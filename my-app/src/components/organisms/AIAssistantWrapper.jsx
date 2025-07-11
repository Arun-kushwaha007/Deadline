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
        <div className="absolute bottom-16 right-0 mb-2 animate-in slide-in-from-bottom-3 fade-in duration-500">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-2xl border border-gray-200 dark:border-gray-700 max-w-xs relative">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">
                  AI Assistant Ready!
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  I'm here to help with your tasks and productivity. Click to start chatting!
                </p>
             
                <div className="mt-2 flex items-center gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    Auto-closes in 10s
                  </span>
                </div>
              </div>
              <button
                onClick={handleCloseNotification}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Close notification"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            
        
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-b-xl overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-blue-600 animate-progress-bar"></div>
            </div>
            
         
            <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700"></div>
          </div>
        </div>
      )}

  
      <Magnet padding={200} disabled={false} magnetStrength={5}>
        <div className="relative">
          <button
            onClick={togglePanel}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative w-14 h-14 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${
              isOpen
                ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
                : 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700'
            }`}
            aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
          >
            {/* Background Glow */}
            <div className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
              isOpen 
                ? 'bg-gradient-to-r from-red-500 to-pink-600 opacity-30 blur-lg scale-150'
                : 'bg-gradient-to-r from-purple-500 to-blue-600 opacity-30 blur-lg scale-150'
            }`}></div>
            
          
            <div className="relative z-10 flex items-center justify-center w-full h-full text-white">
              {isOpen ? (
                <X className="w-6 h-6 transition-transform duration-200" />
              ) : (
                <MessageCircle className="w-6 h-6 transition-transform duration-200" />
              )}
            </div>

            {!isOpen && hasNewMessage && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse">
                <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
              </div>
            )}

            {/* Sparkle Effect */}
            {!isOpen && (
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <Sparkles className={`absolute top-2 right-2 w-3 h-3 text-yellow-300 transition-opacity duration-500 ${
                  isHovered ? 'opacity-100 animate-pulse' : 'opacity-0'
                }`} />
              </div>
            )}
          </button>

          {/* Hover Tooltip */}
          {isHovered && !isOpen && !hasNewMessage && (
            <div className="absolute bottom-16 right-0 mb-2 animate-in fade-in duration-200">
              <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
                Chat with AI Assistant
                <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 dark:bg-gray-700"></div>
              </div>
            </div>
          )}
        </div>
      </Magnet>

   
      {!isOpen && hasNewMessage && (
        <div className="absolute inset-0 rounded-full">
          <div className="absolute inset-0 rounded-full bg-purple-400 opacity-75 animate-ping"></div>
          <div className="absolute inset-0 rounded-full bg-purple-400 opacity-50 animate-ping animation-delay-200"></div>
        </div>
      )}
    </div>
  );
}

const styles = `
  .animation-delay-200 {
    animation-delay: 200ms;
  }
  
  @keyframes animate-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-in {
    animation: animate-in 0.3s ease-out;
  }
  
  @keyframes progress-bar {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
  
  .animate-progress-bar {
    animation: progress-bar 10s linear forwards;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}