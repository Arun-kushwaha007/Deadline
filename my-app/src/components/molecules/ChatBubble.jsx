// components/molecules/ChatBubble.jsx
const ChatBubble = ({ message, sender }) => {
  const isUser = sender === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-xs p-3 rounded-lg text-sm ${
          isUser
            ? 'bg-primary text-white rounded-br-none'
            : 'bg-gray-700 text-white rounded-bl-none'
        }`}
      >
        {message}
      </div>
    </div>
  );
};

export default ChatBubble;
