import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Chatbot.css";

function Chatbot() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! 👋 I am the Citizen Service Portal assistant. How can I help you?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!input.trim() || loading) return;

    const currentInput = input.trim();

    const userMessage = {
      sender: "user",
      text: currentInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: currentInput,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to get response"
        );
      }

      const botMessage = {
        sender: "bot",
        text: data.reply,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // CLEAR CHAT
  const handleClearChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "Hello! 👋 I am the Citizen Service Portal assistant. How can I help you?",
      },
    ]);

    setInput("");
  };

  return (
    <div className="chatbot-page">
      <div className="chatbot-container">

        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <div className="chatbot-header">
          <h1>Citizen Service Assistant 🤖</h1>

          <p>
            Ask me anything about submitting or managing your
            complaints.
          </p>

          <button
            className="clear-button"
            onClick={handleClearChat}
            disabled={loading}
          >
            Clear Chat
          </button>
        </div>

        <div className="chat-window">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-row ${message.sender}`}
            >
              <div
                className={`chat-message ${
                  message.sender === "user"
                    ? "user-message"
                    : "bot-message"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-row bot">
              <div className="typing">
                Assistant is typing...
              </div>
            </div>
          )}
        </div>

        <form className="chat-form" onSubmit={handleSend}>
          <input
            className="chat-input"
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />

          <button
            className="send-button"
            type="submit"
            disabled={loading || !input.trim()}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>

      </div>
    </div>
  );
}

export default Chatbot;