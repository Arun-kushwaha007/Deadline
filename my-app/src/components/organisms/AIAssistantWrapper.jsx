import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import AIAssistantPanel from './AIAssistantPanel';

import Magnet from '../../animation/Magnet';
export default function AIAssistantWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-10 right-11 z-50">
      <Magnet padding={200} disabled={false} magnetStrength={2}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
          aria-label="Toggle AI Assistant"
        >
          <MessageCircle size={24} />
        </button>
      </Magnet>

      {isOpen && (
        <div className="mt-4">
          <AIAssistantPanel />
        </div>
      )}
    </div>
  );
}
