
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChatMessage } from "@/entities/ChatMessage";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Heart, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addSystemMessage = useCallback(async (content) => {
    const systemMessage = {
      message: content,
      sender: "aya",
      message_type: "text",
      session_id: sessionId
    };
    
    try {
      const saved = await ChatMessage.create(systemMessage);
      setMessages(prev => [...prev, saved]);
    } catch (error) {
      console.error("Error saving system message:", error);
    }
  }, [sessionId]);

  const loadChatHistory = useCallback(async () => {
    try {
      const history = await ChatMessage.filter({ session_id: sessionId }, "created_date", 50);
      setMessages(history);
      
      // Add welcome message if no history
      if (history.length === 0) {
        await addSystemMessage("Hi there! 🌸 I'm Aya, your personal wellness companion. I'm here to listen, support, and chat about whatever is on your mind. What would you like to talk about today?");
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  }, [sessionId, addSystemMessage]);

  useEffect(() => {
    loadChatHistory();
  }, [loadChatHistory]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      message: inputMessage.trim(),
      sender: "user",
      message_type: "text",
      session_id: sessionId
    };

    try {
      // Save user message
      const savedUserMessage = await ChatMessage.create(userMessage);
      setMessages(prev => [...prev, savedUserMessage]);
      
      const currentInput = inputMessage;
      setInputMessage("");
      setIsLoading(true);

      // Get conversation history for context
      const recentMessages = messages.slice(-10).map(m => 
        `${m.sender === 'user' ? 'User' : 'Aya'}: ${m.message}`
      ).join('\n');

      // Generate AI response
      const prompt = `You are Aya, a warm, empathetic AI mental wellness companion designed specifically for youth. Your role is to provide supportive, non-judgemental conversations while being mindful of mental health concerns.

Key guidelines:
- Use a warm, friend-like tone (not clinical or overly formal)
- Be genuinely empathetic and validate feelings
- Ask open-ended follow-up questions to encourage sharing
- Offer gentle suggestions for coping strategies when appropriate
- If someone mentions crisis thoughts, gently suggest professional help
- Keep responses conversational and youth-friendly
- Use emojis sparingly but warmly
- Never diagnose or give medical advice

Recent conversation:
${recentMessages}

User just said: "${currentInput}"

Respond as Aya with empathy and care:`;

      const response = await InvokeLLM({
        prompt,
        add_context_from_internet: false
      });

      // Save AI response
      const aiMessage = {
        message: response,
        sender: "aya",
        message_type: "text",
        session_id: sessionId
      };

      const savedAiMessage = await ChatMessage.create(aiMessage);
      setMessages(prev => [...prev, savedAiMessage]);

    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message
      setMessages(prev => [...prev, {
        id: `error_${Date.now()}`,
        message: "I'm having trouble connecting right now. Please try again in a moment. 💙",
        sender: "aya",
        message_type: "text",
        session_id: sessionId
      }]);
    }
    
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-none shadow-lg p-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Chat with Aya</h1>
            <p className="text-gray-500">Your confidential wellness companion</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={message.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] md:max-w-[60%] ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white shadow-lg' 
                    : 'bg-white/90 backdrop-blur-sm text-gray-800 border-2 border-gray-100 shadow-lg'
                } rounded-3xl px-6 py-4`}>
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {message.message}
                  </p>
                  <p className={`text-xs mt-3 ${
                    message.sender === 'user' ? 'text-white/60' : 'text-gray-400'
                  }`}>
                    {new Date(message.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white/90 backdrop-blur-sm border-2 border-gray-100 rounded-3xl px-6 py-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                    <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  </div>
                  <span className="text-gray-600">Aya is typing...</span>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 border-t border-indigo-200 px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3 text-indigo-700">
          <Shield className="w-5 h-5" />
          <span className="font-medium">🔒 This conversation is private and confidential</span>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white/90 backdrop-blur-xl border-t border-gray-200 shadow-lg p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4 items-end">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind..."
                className="resize-none border-2 border-gray-200 rounded-3xl pr-4 focus:border-purple-300 focus:ring-purple-200 min-h-[60px] max-h-[120px] text-base bg-gray-50 focus:bg-white"
                rows={2}
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 text-white rounded-3xl p-4 min-w-[60px] h-[60px] shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Send className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
