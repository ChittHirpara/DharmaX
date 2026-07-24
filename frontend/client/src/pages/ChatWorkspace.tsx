import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import type { Message, Conversation, Persona } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowLeft, Send, LogOut, Plus, Settings as SettingsIcon, Trash2, Edit2, Home, ShieldAlert, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ChatWorkspace = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const stateConvoId = location.state?.activeConversationId;
  const initialMessage = location.state?.initialMessage as string | undefined;

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isReflecting, setIsReflecting] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial Load (Works for both logged in and guest users)
  useEffect(() => {
    async function initData() {
      try {
        const [personaList, convoList] = await Promise.all([
          api.getPersonas(),
          api.getConversations()
        ]);
        
        setPersonas(personaList);
        setConversations(convoList);

        if (stateConvoId) {
          setActiveConvoId(stateConvoId);
        } else if (convoList.length > 0) {
          setActiveConvoId(convoList[0].id);
        } else {
          // If no conversations exist, automatically create one with the Companion persona
          const newConvo = await api.createConversation('companion', '');
          setConversations([newConvo]);
          setActiveConvoId(newConvo.id);
        }
      } catch (err) {
        console.error('Error loading initial chat data:', err);
      }
    }
    initData();
  }, [stateConvoId]);

  // Load Messages on Convo Change
  useEffect(() => {
    if (!activeConvoId) {
      setMessages([]);
      return;
    }

    async function loadMessages() {
      setLoadingHistory(true);
      try {
        const history = await api.getMessages(activeConvoId!);
        setMessages(history);
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setLoadingHistory(false);
      }
    }
    loadMessages();
  }, [activeConvoId]);

  // Auto-send initial message that came from landing page ChatPreview
  const hasSentInitial = useRef(false);
  useEffect(() => {
    if (initialMessage && activeConvoId && !hasSentInitial.current && !isReflecting) {
      hasSentInitial.current = true;
      setTimeout(() => sendUserMessage(initialMessage), 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessage, activeConvoId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isReflecting]);

  const sendUserMessage = async (text: string) => {
    if (!text.trim() || !activeConvoId || isReflecting) return;

    // Append user message locally
    const newUserMsg: Message = {
      sender: 'user',
      content: text,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, newUserMsg]);
    setIsReflecting(true);

    try {
      const response = await api.sendMessage(activeConvoId, text);
      setMessages(prev => [...prev, response]);
      setIsReflecting(false);
      
      // Refresh conversations list to update sidebar message descriptions
      api.getConversations().then(setConversations).catch(console.error);

    } catch (err) {
      console.error('Error sending message:', err);
      setIsReflecting(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const msg = inputMsg;
    setInputMsg('');
    await sendUserMessage(msg);
  };

  const handleCreateNewChat = async () => {
    try {
      const newConvo = await api.createConversation('companion', '');
      setConversations(prev => [newConvo, ...prev]);
      setActiveConvoId(newConvo.id);
    } catch (err) {
      console.error("Failed to create conversation", err);
    }
  };

  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this conversation?")) return;
    try {
      await api.deleteConversation(id);
      setConversations(prev => prev.filter(c => c.id !== id));
      if (activeConvoId === id) {
        setActiveConvoId(conversations.find(c => c.id !== id)?.id || null);
      }
    } catch (err) {
      console.error("Failed to delete conversation", err);
    }
  };

  const handleRenameConversation = async (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newName = window.prompt("Rename conversation:", currentTitle);
    if (newName && newName.trim() !== currentTitle) {
      try {
        await api.renameConversation(id, newName.trim());
        setConversations(prev => prev.map(c => c.id === id ? { ...c, title: newName.trim() } : c));
      } catch (err) {
        console.error("Failed to rename conversation", err);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const activeConversation = conversations.find((c) => c.id === activeConvoId);
  const activeBotName = activeConversation?.bot_name || 'Noerax Guide';

  const handleRenameBot = async () => {
    const newName = window.prompt("What would you like to name your guide?", activeBotName);
    if (newName && newName.trim() !== '' && newName.trim() !== activeBotName) {
      const isNewChat = window.confirm(`Start a NEW chat with ${newName.trim()}? (Cancel to rename in THIS chat)`);
      try {
        if (isNewChat) {
          const newConvo = await api.createConversation('companion', '', newName.trim());
          setConversations(prev => [newConvo, ...prev]);
          setActiveConvoId(newConvo.id);
        } else if (activeConvoId) {
          await api.updateConversationBotName(activeConvoId, newName.trim());
          setConversations(prev => prev.map(c => c.id === activeConvoId ? { ...c, bot_name: newName.trim() } : c));
        }
      } catch (err) {
        console.error('Failed to rename guide', err);
        alert('Failed to rename guide');
      }
    }
  };

  return (
    <div className="relative min-h-screen flex font-sans bg-dharma-ink overflow-x-hidden text-dharma-ivory">
      
      {/* Warm Dharma Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-dharma-flame/5 blur-[140px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-dharma-saffron/5 blur-[120px] rounded-full" />
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-80 bg-dharma-ink-2/90 backdrop-blur-xl border-r border-dharma-line-dark relative z-10 p-5 justify-between">
        <div className="space-y-6 flex flex-col h-full">
          {/* Logo & Guide Title */}
          <div className="flex items-center justify-between pb-4 border-b border-dharma-line-dark">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
              <span className="text-dharma-flame text-2xl leading-none font-serif">☼</span>
              <span className="text-xl font-serif text-dharma-ivory tracking-wide">
                Noera<span className="gradient-text font-bold">X</span>
              </span>
            </div>
            <button onClick={handleRenameBot} className="text-dharma-ivory-dim hover:text-dharma-flame p-1 transition-colors" title="Rename Guide">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          {/* Nav Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/')}
              className="px-3.5 py-3 rounded-xl border border-dharma-line-dark bg-dharma-ink-3/40 hover:bg-dharma-ink-3 text-dharma-ivory-dim hover:text-dharma-ivory text-sm font-semibold flex items-center justify-center transition-all duration-200"
              title="Back to Home"
            >
              <Home className="w-4 h-4" />
            </button>
            <button
              onClick={handleCreateNewChat}
              className="flex-grow py-3 rounded-xl bg-dharma-flame/10 hover:bg-dharma-flame/20 border border-dharma-flame/30 text-dharma-flame text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-md shadow-dharma-flame/10"
            >
              <Plus className="w-4 h-4" /> New Conversation
            </button>
          </div>

          {/* Recent Conversations List */}
          <div className="space-y-2 flex-grow overflow-hidden flex flex-col">
            <h4 className="text-[11px] font-semibold text-dharma-ivory-dim/70 tracking-wider uppercase mb-1">Recent Conversations</h4>
            <div className="space-y-1.5 overflow-y-auto pr-1 flex-grow h-0">
              {conversations.map((convo) => {
                const isActive = convo.id === activeConvoId;
                const title = (convo as any).title || (convo.bot_name && convo.bot_name !== 'Companion' ? `${convo.bot_name}` : 'Noerax Guide');
                return (
                  <div
                    key={convo.id}
                    onClick={() => setActiveConvoId(convo.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-200 group ${
                      isActive 
                        ? 'bg-dharma-flame/10 border border-dharma-flame/40 text-dharma-ivory shadow-sm' 
                        : 'bg-dharma-ink-3/30 hover:bg-dharma-ink-3/70 border border-transparent text-dharma-ivory-dim'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-grow min-w-0 pr-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-sm font-semibold truncate ${isActive ? 'text-dharma-flame' : 'text-dharma-ivory'}`}>
                            {title}
                          </span>
                          <span className="text-[10px] text-dharma-ivory-dim/60 shrink-0">
                            {convo.last_message_time ? new Date(convo.last_message_time).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : ''}
                          </span>
                        </div>
                        <p className="text-xs text-dharma-ivory-dim/70 truncate">
                          {convo.last_message_content || 'A quiet space for reflection.'}
                        </p>
                      </div>
                      <div className="flex-col gap-1 hidden group-hover:flex">
                         <button onClick={(e) => handleRenameConversation(convo.id, title, e)} className="p-1 text-dharma-ivory-dim hover:text-dharma-flame transition-colors">
                           <Edit2 className="w-3.5 h-3.5" />
                         </button>
                         <button onClick={(e) => handleDeleteConversation(convo.id, e)} className="p-1 text-dharma-ivory-dim hover:text-red-400 transition-colors">
                           <Trash2 className="w-3.5 h-3.5" />
                         </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer User Info */}
        {user ? (
          <div className="space-y-3 pt-4 border-t border-dharma-line-dark mt-4">
            <div className="flex items-center gap-3 px-1">
              <div className="w-8 h-8 rounded-full bg-dharma-flame/15 border border-dharma-flame/30 flex items-center justify-center text-xs font-bold text-dharma-flame uppercase">
                {(user.username || user.email || '?').substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-xs font-semibold text-dharma-ivory truncate">{user.username || user.email}</p>
              </div>
              <button onClick={() => navigate('/settings')} className="text-dharma-ivory-dim hover:text-dharma-ivory p-1">
                <SettingsIcon className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center justify-center gap-2 border border-red-500/20 transition-all duration-200"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        ) : (
          <div className="pt-4 border-t border-dharma-line-dark mt-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2.5 rounded-xl bg-dharma-flame/10 hover:bg-dharma-flame/20 text-dharma-flame text-xs font-semibold flex items-center justify-center gap-2 border border-dharma-flame/30 transition-all duration-200"
            >
              Sign in to save chats
            </button>
          </div>
        )}
      </aside>

      {/* Main Chat Area */}
      <main className="flex-grow flex flex-col h-screen relative z-10 bg-transparent">
        {/* Header */}
        <header className="px-6 py-4 border-b border-dharma-line-dark bg-dharma-ink-2/80 backdrop-blur-xl flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="md:hidden p-2 rounded-xl bg-dharma-ink-3 text-dharma-ivory-dim hover:text-dharma-ivory"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-dharma-flame/10 border border-dharma-flame/30 flex items-center justify-center">
                <span className="text-dharma-flame font-serif text-lg">ॐ</span>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-dharma-ink-2" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-serif font-bold text-dharma-ivory">{activeBotName}</h2>
              </div>
              <p className="text-xs text-dharma-ivory-dim flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Spiritual AI Guide · Ancient Wisdom & Modern Clarity
              </p>
            </div>
          </div>
          
          <button
             onClick={handleCreateNewChat}
             className="md:hidden px-3.5 py-1.5 rounded-full bg-dharma-flame/10 border border-dharma-flame/30 text-xs font-semibold text-dharma-flame flex items-center gap-1"
          >
             <Plus className="w-3.5 h-3.5" /> New
          </button>
        </header>

        {/* Message Log */}
        <div className="flex-grow overflow-y-auto px-4 md:px-12 py-8 space-y-6">
          {loadingHistory ? (
            <div className="flex items-center justify-center h-full text-dharma-ivory-dim text-sm">
              Connecting to wisdom...
            </div>
          ) : (
            <>
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto space-y-6">
                  <div className="w-16 h-16 rounded-full bg-dharma-flame/10 border border-dharma-flame/20 flex items-center justify-center shadow-xl shadow-dharma-flame/10">
                    <span className="text-dharma-flame font-serif text-3xl">ॐ</span>
                  </div>
                  <div>
                    <h1 className="font-serif text-3xl md:text-4xl text-dharma-ivory font-bold mb-3">
                      Find clarity in <span className="gradient-text">conversation.</span>
                    </h1>
                    <p className="text-dharma-ivory-dim text-sm md:text-base leading-relaxed">
                      Speak freely about your anxieties, questions, or feelings. Noerax is trained on Vedanta, Stoicism, Buddhism, and modern psychology to guide you without judgment.
                    </p>
                  </div>

                  {/* Suggested Prompts Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full pt-2">
                    {[
                      "I feel anxious about my future",
                      "How do I find my purpose?",
                      "I'm exhausted and burnt out",
                      "Help me let go of control"
                    ].map(prompt => (
                      <button
                        key={prompt}
                        onClick={() => sendUserMessage(prompt)}
                        className="p-3 text-xs rounded-xl bg-dharma-ink-2 border border-dharma-line-dark hover:border-dharma-flame/40 text-dharma-ivory-dim hover:text-dharma-ivory text-left transition-all duration-200"
                      >
                        "{prompt}"
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, index) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={index}
                    className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${
                      isUser
                        ? 'bg-dharma-ink-3 border border-dharma-line-dark'
                        : 'bg-dharma-flame/10 border border-dharma-flame/20'
                    }`}>
                      {isUser
                        ? <User className="w-4 h-4 text-dharma-ivory-dim" />
                        : <span className="text-dharma-flame font-serif text-sm">ॐ</span>
                      }
                    </div>

                    {/* Bubble */}
                    <div className={`max-w-[85%] md:max-w-2xl flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                          isUser
                            ? 'bg-dharma-flame text-white rounded-tr-sm shadow-md shadow-dharma-flame/10'
                            : msg.isCrisis
                            ? 'bg-red-950/80 border border-red-500/40 text-red-100 rounded-tl-sm space-y-4'
                            : 'bg-dharma-ink-2 text-dharma-ivory border border-dharma-line-dark rounded-tl-sm shadow-sm'
                        }`}
                      >
                        {msg.isCrisis ? (
                          <>
                            <div className="flex items-start gap-3">
                              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                              <div className="space-y-1">
                                <p className="font-bold text-red-300 text-sm">Support Resources</p>
                                <p className="text-sm text-red-200/90 whitespace-pre-wrap">{msg.content}</p>
                              </div>
                            </div>
                            {msg.resources && (
                              <div className="mt-4 pt-3 border-t border-red-500/40 flex flex-wrap gap-3 items-center justify-between">
                                <div className="text-xs font-bold text-white bg-red-800/80 px-3 py-1.5 rounded-lg border border-red-500/40">
                                  Call or Text: {msg.resources.phone}
                                </div>
                                <a
                                  href={msg.resources.website}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-red-300 hover:text-white underline font-semibold"
                                >
                                  Visit Website
                                </a>
                              </div>
                            )}
                          </>
                        ) : (
                          <p>{msg.content}</p>
                        )}
                      </div>
                      <span className="text-[10px] text-dharma-ivory-dim/50 mt-1 px-1 font-medium">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isReflecting && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-dharma-flame/10 border border-dharma-flame/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-dharma-flame font-serif text-sm">ॐ</span>
                  </div>
                  <div className="bg-dharma-ink-2 border border-dharma-line-dark px-5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay }}
                        className="w-2 h-2 rounded-full bg-dharma-flame"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} className="h-4" />
            </>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 md:p-6 bg-dharma-ink-2/90 backdrop-blur-xl border-t border-dharma-line-dark flex-shrink-0">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-3">
            <div className="flex-1 bg-dharma-ink-3 border border-dharma-line-dark rounded-full px-5 py-2.5 flex items-center gap-3 focus-within:border-dharma-flame/50 transition-colors">
              <textarea
                rows={1}
                value={inputMsg}
                onChange={(e) => {
                  setInputMsg(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (inputMsg.trim() && !isReflecting) {
                      handleSendMessage(e as unknown as React.FormEvent);
                      e.currentTarget.style.height = 'auto';
                    }
                  }
                }}
                disabled={isReflecting}
                placeholder={isReflecting ? `${activeBotName} is reflecting...` : "Ask for guidance..."}
                className="flex-1 bg-transparent border-none outline-none text-dharma-ivory placeholder:text-dharma-ivory-dim/50 text-sm md:text-base min-w-0 resize-none overflow-y-auto"
                style={{ minHeight: '32px', maxHeight: '140px' }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!inputMsg.trim() || isReflecting}
                className="w-10 h-10 rounded-full bg-dharma-flame text-white flex items-center justify-center hover:bg-dharma-saffron transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-dharma-flame/20 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
