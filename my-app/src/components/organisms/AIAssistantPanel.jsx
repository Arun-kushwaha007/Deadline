import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle, Sparkles, RefreshCw } from 'lucide-react';
import { fetchAIResponse } from '../../utils/aiHelper';

export default function AIAssistantPanel() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage = { 
      id: Date.now(), 
      sender: 'user', 
      message: input,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiReply = await fetchAIResponse(input);
      const assistantMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        message: aiReply,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        message: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <aside className="w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300">
      {/* Header - Reduced */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">AI Assistant</h2>
              <p className="text-purple-100 text-xs">Here to help!</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            title="Clear chat"
          >
            <RefreshCw className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>

      {/* Messages Area - Reduced Height */}
      <div className="h-60 overflow-y-auto p-3 space-y-3 bg-gray-50 dark:bg-gray-900">
        {messages.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1">
              AI Assistant
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              Ask about tasks, productivity tips, or project management.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar - Smaller */}
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                msg.sender === 'user'
                  ? 'bg-blue-500'
                  : msg.isError
                  ? 'bg-red-500'
                  : 'bg-purple-500'
              }`}>
                {msg.sender === 'user' ? (
                  <User className="w-3 h-3 text-white" />
                ) : (
                  <Bot className="w-3 h-3 text-white" />
                )}
              </div>

              {/* Message Bubble - Compact */}
              <div className={`max-w-xs ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`p-2 rounded-xl ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-br-sm'
                    : msg.isError
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-bl-sm'
                    : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white rounded-bl-sm'
                }`}>
                  <p className="text-xs leading-relaxed">{msg.message}</p>
                </div>
                <p className={`text-xs text-gray-500 dark:text-gray-400 mt-0.5 ${
                  msg.sender === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}

        {/* Loading indicator - Compact */}
        {isLoading && (
          <div className="flex gap-2">
            <div className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <Bot className="w-3 h-3 text-white" />
            </div>
            <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-2 rounded-xl rounded-bl-sm">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Compact */}
      <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              className="w-full px-3 py-2 pr-8 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <MessageCircle className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
          </div>
          <button
            className={`px-3 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
              input.trim() && !isLoading
                ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:from-purple-600 hover:to-blue-700 shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Quick Actions - Compact */}
        <div className="mt-2 flex flex-wrap gap-1">
          {['Tasks', 'Tips', 'Ideas'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInput(suggestion === 'Tasks' ? 'Help with tasks' : suggestion === 'Tips' ? 'Productivity tips' : 'Project ideas')}
              className="px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}