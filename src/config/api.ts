import OpenAI from "openai";

export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: true,
  defaultHeaders: {
    "HTTP-Referer": import.meta.env.VITE_SITE_URL,
    "X-Title": import.meta.env.VITE_SITE_NAME,
    "Content-Type": "application/json",
  },
});
