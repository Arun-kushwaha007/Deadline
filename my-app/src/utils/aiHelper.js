export const fetchAIResponse = async (prompt) => {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || 'Sorry, no response.';
  } catch (err) {
    console.error(err);
    return '⚠️ Error communicating with AI.';
  }
};
