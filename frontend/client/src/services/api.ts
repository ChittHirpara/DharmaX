const API_BASE_URL = '/api';

export interface User {
  id: string;
  email: string;
  username?: string;
  bot_name?: string;
}

export interface Persona {
  id: string;
  name: string;
  title: string;
  description: string;
  avatar_url: string;
  color_accent: string;
  few_shots: Array<{ user: string; assistant: string }>;
}

export interface Conversation {
  id: string;
  persona_id: string;
  created_at: string;
  updated_at: string;
  bot_name?: string;
  last_message_content?: string;
  last_message_time?: string;
}

export interface Message {
  sender: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  isCrisis?: boolean;
  resources?: {
    lifeline: string;
    phone: string;
    website: string;
  };
}

function getHeaders() {
  const token = localStorage.getItem('sattva_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export const api = {
  // Auth
  async updateBotName(bot_name: string): Promise<{ success: boolean; bot_name: string }> {
    const res = await fetch(`${API_BASE_URL}/auth/bot-name`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ bot_name })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update bot name');
    }
    return res.json();
  },

  async register(username: string, email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async getMe(): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders()
    });
    if (!res.ok) {
      throw new Error('Unauthorized');
    }
    return res.json();
  },

  // Personas
  async getPersonas(): Promise<Persona[]> {
    const res = await fetch(`${API_BASE_URL}/personas`);
    if (!res.ok) {
      throw new Error('Failed to fetch personas');
    }
    return res.json();
  },

  // Conversations
  async getConversations(): Promise<Conversation[]> {
    const res = await fetch(`${API_BASE_URL}/conversations`, {
      headers: getHeaders()
    });
    if (!res.ok) {
      throw new Error('Failed to fetch conversations');
    }
    return res.json();
  },

  async createConversation(personaId: string, initialCheckin?: string, botName?: string): Promise<Conversation> {
    const res = await fetch(`${API_BASE_URL}/conversations/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ personaId, initialCheckin, botName })
    });
    if (!res.ok) {
      throw new Error('Failed to create conversation');
    }
    return res.json();
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const res = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
      headers: getHeaders()
    });
    if (!res.ok) {
      throw new Error('Failed to fetch messages');
    }
    return res.json();
  },

  // Send Message
  async sendMessage(conversationId: string, message: string): Promise<Message> {
    const res = await fetch(`${API_BASE_URL}/chat/message`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ conversationId, message })
    });
    if (!res.ok) {
      throw new Error('Failed to send message');
    }
    return res.json();
  },

  // Delete Conversation
  async deleteConversation(conversationId: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/conversations/${conversationId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) {
      throw new Error('Failed to delete conversation');
    }
  },

  // Delete All Conversations
  async deleteAllConversations(): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/conversations`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) {
      throw new Error('Failed to delete all conversations');
    }
  },

  // Rename Conversation
  async renameConversation(conversationId: string, newName: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/conversations/${conversationId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ title: newName })
    });
    if (!res.ok) {
      throw new Error('Failed to rename conversation');
    }
  },

  async updateConversationBotName(conversationId: string, bot_name: string): Promise<{ success: boolean; bot_name: string }> {
    const res = await fetch(`${API_BASE_URL}/conversations/${conversationId}/bot-name`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ bot_name })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update conversation bot name');
    }
    return res.json();
  }
};
