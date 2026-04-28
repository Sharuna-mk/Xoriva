import { useState, useRef, useEffect } from "react";
import { baseURL } from "../../services/baseURL";

function Chat() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! Welcome to Xoriva. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const now = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const sendMessage = async (text = input) => {
    if (!text.trim() || loading) return;

    const userMessage = { role: "user", text, time: now() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setMessages((prev) => [...prev, { role: "bot", text: "typing", time: "" }]);

    try {
      const res = await fetch(`${baseURL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "bot", text: data.reply, time: now() };
        return updated;
      });
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "bot",
          text: "Error connecting to server.",
    
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const suggestions = ["Return policy", "Shipping time", "Payment methods"];

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="flex flex-col w-[380px] h-[500px] rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1a2e]">
          <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-medium text-sm"
            style={{ background: "linear-gradient(135deg, #7f77dd, #5dcaa5)" }}>
            X
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium leading-none mb-1">Xoriva Assistant</p>
            <p className="text-[11px] text-[#9fa8c0] flex items-center gap-1">
             
            </p>
          </div>
        
        </div>

        {/* Date separator */}
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-[11px] text-gray-400">Today</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 pb-2 flex flex-col gap-2.5 scrollbar-hide">
          {messages.map((msg, i) =>
            msg.role === "user" ? (
              <div key={i} className="flex justify-end">
                <div className="max-w-[72%] bg-[#1a1a2e] rounded-2xl rounded-br-[4px] px-3 py-2.5">
                  <p className="text-[13px] text-[#f0f4ff] leading-relaxed m-0">{msg.text}</p>
                  <p className="text-[10px] text-[#7a8aaa] text-right mt-1 m-0">{msg.time}</p>
                </div>
              </div>
            ) : (
              <div key={i} className="flex gap-2 items-end">
                <div className="w-7 h-7 rounded-full bg-[#1a1a2e] flex-shrink-0 flex items-center justify-center text-[11px] text-[#9fa8c0] font-medium">
                  X
                </div>
                <div className="max-w-[72%] bg-gray-100 border border-gray-200 rounded-2xl rounded-bl-[4px] px-3 py-2.5">
                  {msg.text === "typing" ? (
                    <div className="flex gap-1 items-center py-0.5">
                      {[0, 1, 2].map((d) => (
                        <span
                          key={d}
                          className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block animate-bounce"
                          style={{ animationDelay: `${d * 0.15}s` }}
                        />
                      ))}
                    </div>
                  ) : (
                    <>
                      <p className="text-[13px] text-gray-800 leading-relaxed m-0">{msg.text}</p>
                      <p className="text-[10px] text-gray-400 mt-1 m-0">{msg.time}</p>
                    </>
                  )}
                </div>
              </div>
            )
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion pills */}
        <div className="flex gap-1.5 px-3 py-2 overflow-x-auto border-t border-gray-100 scrollbar-hide">
          {suggestions.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="text-[11px] px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-gray-500 whitespace-nowrap hover:bg-gray-100 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-2 px-3 pb-3 pt-2 border-t border-gray-100">
          <input
            className="flex-1 text-[13px] px-3 py-2 rounded-full border border-gray-200 bg-gray-50 text-gray-800 outline-none focus:border-gray-400 transition-colors"
            placeholder="Ask your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading}
            className="w-9 h-9 rounded-full bg-[#1a1a2e] flex items-center justify-center flex-shrink-0 disabled:opacity-50 hover:opacity-80 transition-opacity"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}

export default Chat;