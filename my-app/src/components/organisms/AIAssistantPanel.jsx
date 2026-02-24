import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle, Sparkles, RefreshCw, GripVertical } from 'lucide-react';
import { fetchAIResponse } from '../../utils/aiHelper';

export default function AIAssistantPanel() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [panelSize, setPanelSize] = useState({ width: 320, height: 400 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState(null);
  const messagesEndRef = useRef(null);
  const panelRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Resize handlers
  const handleMouseDown = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeType(type);
    
    const handleMouseMove = (e) => {
      if (!panelRef.current) return;

      const rect = panelRef.current.getBoundingClientRect();
      
      if (type === 'width') {
        const newWidth = Math.max(280, Math.min(600, rect.right - e.clientX));
        setPanelSize(prev => ({ ...prev, width: newWidth }));
      } else if (type === 'height') {
        const newHeight = Math.max(300, Math.min(800, rect.bottom - e.clientY));
        setPanelSize(prev => ({ ...prev, height: newHeight }));
      } else if (type === 'both') {
        const newWidth = Math.max(280, Math.min(600, rect.right - e.clientX));
        const newHeight = Math.max(300, Math.min(800, rect.bottom - e.clientY));
        setPanelSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeType(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    // Cleanup function for component unmount
    return () => {
      // Remove any remaining event listeners
      document.removeEventListener('mousemove', () => {});
      document.removeEventListener('mouseup', () => {});
    };
  }, []);

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

  const messagesHeight = panelSize.height - 180; // Subtract header and input area heights

  return (
    <aside 
      ref={panelRef}
      className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300 select-none"
      style={{ 
        width: `${panelSize.width}px`, 
        height: `${panelSize.height}px`,
        minWidth: '280px',
        minHeight: '300px',
        maxWidth: '600px',
        maxHeight: '800px'
      }}
    >
      {/* Resize Handles */}
      {/* Left resize handle (width) */}
      <div
        className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-primary/50 transition-colors z-10 bg-transparent"
        onMouseDown={(e) => handleMouseDown(e, 'width')}
        title="Resize width"
      />
      
      {/* Top resize handle (height) */}
      <div
        className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-primary/50 transition-colors z-10 bg-transparent"
        onMouseDown={(e) => handleMouseDown(e, 'height')}
        title="Resize height"
      />
      
      {/* Top-left corner resize handle (both) */}
      <div
        className="absolute top-0 left-0 w-6 h-6 cursor-nw-resize hover:bg-primary/70 transition-colors z-20 flex items-center justify-center bg-transparent"
        onMouseDown={(e) => handleMouseDown(e, 'both')}
        title="Resize both dimensions"
      >
        <GripVertical className="w-3 h-3 text-muted-foreground hover:text-purple-500 transition-colors" />
      </div>

      {/* Header */}
      <div className="bg-primary border-b border-border p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">AI Assistant</h2>
              <p className="text-primary-foreground/80 text-xs">
                {panelSize.width}×{panelSize.height} • Resizable
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={clearChat}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              title="Clear chat"
            >
              <RefreshCw className="w-3.5 h-3.5 text-white" />
            </button>
            <div className="text-white/60 text-xs ml-1">
              <GripVertical className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        className="overflow-y-auto p-3 space-y-3 bg-background"
        style={{ height: `${messagesHeight}px` }}
      >
        {messages.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-border">
              <Sparkles className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">
              AI Assistant
            </h3>
            <p className="text-muted-foreground text-xs">
              Ask about tasks, productivity tips, or project management.
            </p>
            <div className="mt-4 text-xs text-muted-foreground">
              💡 Drag the edges to resize this panel
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                msg.sender === 'user'
                  ? 'bg-primary'
                  : msg.isError
                  ? 'bg-destructive'
                  : 'bg-primary'
              }`}>
                {msg.sender === 'user' ? (
                  <User className="w-3 h-3 text-white" />
                ) : (
                  <Bot className="w-3 h-3 text-white" />
                )}
              </div>

         
              <div className={`${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
                   style={{ maxWidth: `${panelSize.width - 100}px` }}>
                <div className={`p-2 rounded-xl break-words ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white rounded-br-sm'
                    : msg.isError
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-bl-sm'
                    : 'bg-white dark:bg-accent border border-border text-foreground rounded-bl-sm'
                }`}>
                  <p className="text-xs leading-relaxed">{msg.message}</p>
                </div>
                <p className={`text-xs text-muted-foreground mt-0.5 ${
                  msg.sender === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}

     
        {isLoading && (
          <div className="flex gap-2">
            <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <Bot className="w-3 h-3 text-white" />
            </div>
            <div className="bg-white dark:bg-accent border border-border p-2 rounded-xl rounded-bl-sm">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-card border-t border-border">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              className="w-full px-3 py-2 pr-8 rounded-lg bg-accent text-foreground placeholder-slate-500 dark:placeholder-muted-foreground border border-border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <MessageCircle className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <button
            className={`px-3 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
              input.trim() && !isLoading
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
                : 'bg-slate-200 dark:bg-accent text-muted-foreground cursor-not-allowed'
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

        {/* Quick Actions */}
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

      {/* Resize indicator overlay when resizing */}
      {isResizing && (
        <div className="absolute inset-0 bg-primary/10 border-2 border-purple-500 border-dashed rounded-2xl pointer-events-none z-30 flex items-center justify-center">
          <div className="bg-primary text-white px-3 py-1 rounded-lg text-sm font-medium">
            {panelSize.width} × {panelSize.height}
          </div>
        </div>
      )}
    </aside>
  );
}