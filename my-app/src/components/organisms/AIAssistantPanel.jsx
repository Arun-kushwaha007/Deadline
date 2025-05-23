import { useState } from 'react';
import { fetchAIResponse } from '../../utils/aiHelper';

export default function AIAssistantPanel() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { id: Date.now(), sender: 'user', message: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const aiReply = await fetchAIResponse(input);
    const assistantMessage = {
      id: Date.now() + 1,
      sender: 'assistant',
      message: aiReply,
    };

    setMessages((prev) => [...prev, assistantMessage]);
  };

  return (
    <aside className="w-80 bg-zinc-900 text-white p-4 border border-gray-700 rounded-xl shadow-2xl">
      <h2 className="text-lg font-semibold mb-2">🤖 AI Assistant</h2>

      <div className="h-60 overflow-y-auto bg-zinc-800 p-3 rounded-lg mb-2 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-right'
                : 'bg-gray-700 text-left'
            }`}
          >
            {msg.message}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 p-2 rounded bg-zinc-700 text-white"
          placeholder="Ask me something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          className="bg-green-600 px-3 rounded hover:bg-green-700"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </aside>
  );
}
