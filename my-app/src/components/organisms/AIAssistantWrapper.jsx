import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Sparkles, Bot } from 'lucide-react';
import AIAssistantPanel from './AIAssistantPanel';
import Magnet from '../../animation/Magnet';

export default function AIAssistantWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [isHovered, setIsHovered] = useState(false);


  useEffect(() => {
    let initialTimer;
    let recurringInterval;
    let autoCloseTimer;

    const showNotification = () => {
      if (!isOpen) {
        setHasNewMessage(true);
        
        // Auto-close after 10 seconds
        autoCloseTimer = setTimeout(() => {
          setHasNewMessage(false);
        }, 10000);
      }
    };

    // Initial notification after 3 seconds
    initialTimer = setTimeout(() => {
      showNotification();
    }, 3000);

    // Recurring notification every 1 minute (60000ms)
    recurringInterval = setInterval(() => {
      showNotification();
    }, 60000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(recurringInterval);
      clearTimeout(autoCloseTimer);
    };
  }, [isOpen]);

  // Clear notification when panel is opened
  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false);
    }
  }, [isOpen]);

  const togglePanel = () => {
    setIsOpen(!isOpen);
    setHasNewMessage(false);
  };

  const handleCloseNotification = () => {
    setHasNewMessage(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {isOpen && (
        <div className="mb-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <AIAssistantPanel onClose={() => setIsOpen(false)} />
        </div>
      )}

 
      {!isOpen && hasNewMessage && (
        <div className="absolute bottom-[4.5rem] right-0 mb-2 animate-in slide-in-from-bottom-3 fade-in duration-500">
          <div className="bg-card rounded-xl shadow-2xl border border-border w-64 relative p-3">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground">
                  AI Assistant Ready
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 mb-2 leading-relaxed">
                  I'm here to help with your productivity.
                </p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span className="text-[10px] text-muted-foreground">
                    Auto-closes in 10s
                  </span>
                </div>
              </div>
              <button
                onClick={handleCloseNotification}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 flex-shrink-0"
                title="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-border rounded-b-xl overflow-hidden">
              <div className="h-full bg-primary animate-progress-bar"></div>
            </div>
            <div className="absolute -bottom-1 right-6 transform rotate-45 w-2 h-2 bg-card border-r border-b border-border"></div>
          </div>
        </div>
      )}

      <Magnet padding={200} disabled={false} magnetStrength={5}>
        <div className="relative">
          <button
            onClick={togglePanel}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative w-12 h-12 rounded-full shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95 border ${
              isOpen
                ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground'
            }`}
            aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
          >
            <div className="relative z-10 flex items-center justify-center w-full h-full text-foreground">
              {isOpen ? (
                <X className="w-6 h-6 transition-transform duration-200" />
              ) : (
                <MessageCircle className="w-6 h-6 transition-transform duration-200" />
              )}
            </div>

            {!isOpen && hasNewMessage && (
              <div className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-inherit"></div>
            )}
          </button>

          {/* Hover Tooltip */}
          {isHovered && !isOpen && !hasNewMessage && (
            <div className="absolute bottom-16 right-0 mb-2 animate-in fade-in duration-200">
              <div className="bg-slate-900 dark:bg-accent text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
                Chat with AI Assistant
                <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900 dark:bg-accent"></div>
              </div>
            </div>
          )}
        </div>
      </Magnet>
    </div>
  );
}

