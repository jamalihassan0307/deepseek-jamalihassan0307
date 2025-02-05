import OpenAI from "openai";

export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": import.meta.env.VITE_SITE_URL,
    "X-Title": import.meta.env.VITE_SITE_NAME,
  },
});

export const generateResponse = async (prompt: string) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    return completion.choices[0].message;
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
};
