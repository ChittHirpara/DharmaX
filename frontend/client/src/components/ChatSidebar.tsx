 import { motion } from "framer-motion";
 import { BookOpen, Heart, Quote, MessageCircle, Sparkles } from "lucide-react";
 
 interface ChatSidebarProps {
   theme: "ram" | "krishna";
   onQuestionClick: (question: string) => void;
 }
 
 const ramQuickQuestions = [
   { label: "Dharma", question: "What is the true meaning of Dharma and how do I follow it in modern life?" },
   { label: "Leadership", question: "How can I lead with righteousness like you did as a king?" },
   { label: "Courage", question: "How do I find courage in the face of adversity?" },
   { label: "Family Values", question: "How do I balance duty towards family with personal aspirations?" },
   { label: "Duty", question: "What is my duty when faced with difficult choices?" },
 ];
 
 const krishnaQuickQuestions = [
   { label: "Karma", question: "Explain the concept of Karma and how it affects my life." },
   { label: "Love", question: "What is divine love and how do I cultivate it?" },
   { label: "Dharma", question: "How do I find my true Dharma in this world?" },
   { label: "Strategy", question: "How do I navigate difficult situations with wisdom?" },
   { label: "Devotion", question: "What is the path of devotion and how do I walk it?" },
 ];
 
 const sidebarOptions = [
   { label: "Stories", icon: BookOpen },
   { label: "Values", icon: Heart },
   { label: "Daily Quote", icon: Quote },
   { label: "Ask Question", icon: MessageCircle },
 ];
 
 const ChatSidebar = ({ theme, onQuestionClick }: ChatSidebarProps) => {
   const isRam = theme === "ram";
   const quickQuestions = isRam ? ramQuickQuestions : krishnaQuickQuestions;
   const themeColor = isRam ? "ram-gold" : "krishna-blue";
   const gradientClass = isRam ? "bg-gradient-ram" : "bg-gradient-krishna";
 
   return (
     <motion.aside
       initial={{ x: -50, opacity: 0 }}
       animate={{ x: 0, opacity: 1 }}
       transition={{ duration: 0.5, delay: 0.2 }}
       className="hidden lg:flex flex-col w-64 glass-card p-4 m-4 mr-0 rounded-2xl h-[calc(100vh-2rem)]"
       style={{
         borderColor: isRam
           ? "hsla(38, 90%, 55%, 0.3)"
           : "hsla(210, 85%, 50%, 0.3)",
       }}
     >
       {/* Title */}
       <div className="mb-6">
         <h2 className={`font-display text-xl font-bold text-${themeColor} flex items-center gap-2`}>
           <Sparkles className="w-5 h-5" />
           Teachings
         </h2>
       </div>
 
       {/* Quick Questions */}
       <div className="mb-6">
         <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
           Quick Questions
         </h3>
         <div className="space-y-2">
           {quickQuestions.map((item, index) => (
             <motion.button
               key={item.label}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.1 * index }}
               onClick={() => onQuestionClick(item.question)}
               className={`
                 w-full text-left px-3 py-2 rounded-lg text-sm
                 text-foreground/80 hover:text-foreground
                 hover:bg-secondary/50 transition-all duration-200
                 border border-transparent hover:border-${themeColor}/30
               `}
               whileHover={{ x: 4 }}
             >
               {item.label}
             </motion.button>
           ))}
         </div>
       </div>
 
       {/* Divider */}
       <div className={`h-px bg-${themeColor}/20 my-4`} />
 
       {/* Sidebar Options */}
       <div className="flex-1">
         <div className="space-y-2">
           {sidebarOptions.map((option, index) => (
             <motion.button
               key={option.label}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.3 + 0.1 * index }}
               className={`
                 w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                 text-foreground/70 hover:text-foreground
                 hover:bg-secondary/50 transition-all duration-200
               `}
               whileHover={{ x: 4 }}
             >
               <option.icon className="w-4 h-4" />
               {option.label}
             </motion.button>
           ))}
         </div>
       </div>
 
       {/* Bottom decorative element */}
       <motion.div
         className={`mt-auto pt-4 flex justify-center`}
         animate={{ opacity: [0.3, 0.6, 0.3] }}
         transition={{ duration: 3, repeat: Infinity }}
       >
         <div
           className={`w-16 h-1 rounded-full ${gradientClass}`}
           style={{ opacity: 0.5 }}
         />
       </motion.div>
     </motion.aside>
   );
 };
 
 export default ChatSidebar;