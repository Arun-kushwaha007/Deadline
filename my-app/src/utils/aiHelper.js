let lastRequestTime = 0;
const delayBetweenRequests = 1100; // ms (OpenAI limit: ~60 RPM for free tier)

export const fetchAIResponse = async (prompt) => {
  const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  if (!OPENAI_KEY) return '⚠️ Currently Under Development.';

  const now = Date.now();
  const wait = Math.max(0, delayBetweenRequests - (now - lastRequestTime));

  await new Promise((res) => setTimeout(res, wait));
  lastRequestTime = Date.now();

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('❌ OpenAI API Error:', errorData);
      return `⚠️ ${errorData?.error?.message || 'OpenAI Error'}`;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || '⚠️ Empty AI response.';
  } catch (err) {
    console.error('❌ Network Error:', err);
    return '⚠️ Failed to communicate with AI.';
  }
};
