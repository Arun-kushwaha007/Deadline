import { fetchAIResponse } from '../../utils/aiHelper';

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
