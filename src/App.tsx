import React, { useState, useEffect, useRef } from "react";
import { Message, sendMessage } from "./services/chat";
import "./App.css";
import { formatCodeBlock } from "./utils/codeFormatter";

function App() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("chat_messages");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  }, [messages]);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (window.Prism) {
      window.Prism.highlightAll();
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendMessage([...messages, userMessage]);
      if (response) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response.content || "" },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat?")) {
      setMessages([]);
    }
  };

  return (
    <div className={`app ${isDark ? "dark" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <button className="new-chat" onClick={clearChat}>
            <svg viewBox="0 0 24 24" className="icon">
              <path
                d="M12 4v16m-8-8h16"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            New chat
          </button>
        </div>
        <div className="chat-history">
          <div className="history-header">Previous Chats</div>
          <div className="history-list">
            {messages.length > 0 && (
              <div className="history-item">
                <span className="history-icon">💬</span>
                Current Chat ({messages.length} messages)
              </div>
            )}
          </div>
        </div>
        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={() => setIsDark(!isDark)}>
            {isDark ? (
              <svg viewBox="0 0 24 24" className="icon">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2m0 18v2M4 12H2m20 0h-2m-2.8-7.2l-1.4 1.4M6.2 17.8l-1.4 1.4m1.4-12.4l-1.4-1.4m12.4 12.4l1.4 1.4" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="icon">
                <path d="M12 3a9 9 0 109 9c0-4.97-4.03-9-9-9z" />
              </svg>
            )}
            {isDark ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </aside>

      <main className="main">
        {messages.length === 0 ? (
          <div className="welcome-container">
            <div className="welcome-content">
              <h1>DeepSeek AI Assistant</h1>
              <p className="welcome-subtitle">
                Your AI-powered conversation companion
              </p>
              <div className="features-grid">
                <div className="feature-card">
                  <span className="feature-icon">💡</span>
                  <h3>Ask anything</h3>
                  <p>Get detailed explanations on any topic</p>
                </div>
                <div className="feature-card">
                  <span className="feature-icon">💻</span>
                  <h3>Code Help</h3>
                  <p>Debug issues and get code examples</p>
                </div>
                <div className="feature-card">
                  <span className="feature-icon">📚</span>
                  <h3>Learn</h3>
                  <p>Understand complex concepts easily</p>
                </div>
                <div className="feature-card">
                  <span className="feature-icon">🔍</span>
                  <h3>Analysis</h3>
                  <p>Compare technologies and approaches</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="chat-area">
            {messages.map((message, index) => (
              <div key={index} className={`message-wrapper ${message.role}`}>
                <div className="message">
                  <div className="message-header">
                    <div className="avatar">
                      {message.role === "user" ? "You" : "AI"}
                    </div>
                    <div className="message-info">
                      <span className="message-role">
                        {message.role === "user" ? "You" : "Assistant"}
                      </span>
                      <span className="message-time">
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <div
                    className="message-content"
                    dangerouslySetInnerHTML={{
                      __html: formatCodeBlock(message.content),
                    }}
                  />
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message-wrapper assistant">
                <div className="message">
                  <div className="message-header">
                    <div className="avatar">AI</div>
                  </div>
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="input-area">
          <form onSubmit={handleSubmit} className="input-form">
            <div className={`input-wrapper ${isLoading ? "loading" : ""}`}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isLoading ? "Generating response..." : "Message DeepSeek..."
                }
                rows={1}
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <div className="textarea-status">
                {isLoading && "AI is thinking..."}
              </div>
              <button
                type="submit"
                className="send-button visible"
                disabled={!input.trim() || isLoading}
              >
                <svg viewBox="0 0 24 24" className="send-icon">
                  <path d="M2 2l20 10-20 10 3-10 17-2-17-2 3-10z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;
