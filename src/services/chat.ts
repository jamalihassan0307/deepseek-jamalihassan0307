export interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function sendMessage(messages: Message[]) {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "HTTP-Referer": import.meta.env.VITE_SITE_URL,
          "X-Title": import.meta.env.VITE_SITE_NAME,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages,
          temperature: 0.7,
          max_tokens: 500,
          stream: false,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || `API error: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("API Response:", data);

    if (!data.choices?.[0]?.message) {
      throw new Error("Invalid response from API");
    }

    return data.choices[0].message;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}
