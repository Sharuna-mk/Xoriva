import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";

type Message = {
  text: string;
  sender: "user" | "bot";
};

const faqList = [
  {
    question: "dispatch order",
    answer: "Your order will be dispatched within 24-48 hours.",
  },
  {
    question: "delivery time",
    answer: "Delivery usually takes 3-7 business days.",
  },
  {
    question: "track order",
    answer: "You will receive a tracking link once shipped.",
  },
  {
    question: "return policy",
    answer: "Returns are accepted within 7 days of delivery.",
  },
];

const FAQChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi 👋 How can I help you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  // ✅ Improved FAQ matching
  const findFAQAnswer = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return faqList.find((faq) =>
      faq.question.split(" ").some((word) => lowerQuery.includes(word))
    );
  };

  // ✅ AI call
  const getAIResponse = async (query: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: query }),
      });

      if (!res.ok) return "Server busy. Try again.";

      const data = await res.json();
      return data.reply;
    } catch {
      return "Something went wrong.";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { text: userMsg, sender: "user" }]);
    setInput("");

    const match = findFAQAnswer(userMsg);

    if (match) {
      setMessages((prev) => [
        ...prev,
        { text: match.answer, sender: "bot" },
      ]);
    } else {
      setLoading(true);
      const aiReply = await getAIResponse(userMsg);
      setLoading(false);

      setMessages((prev) => [
        ...prev,
        { text: aiReply, sender: "bot" },
      ]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg z-50"
      >
        {open ? <X /> : <MessageCircle />}
      </button>

      {/* Chat Box */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 bg-white rounded-2xl shadow-2xl flex flex-col z-50">

          {/* Header */}
          <div className="bg-blue-600 text-white p-4 font-semibold">
            FAQ Support
          </div>

          {/* Messages */}
          <div
            ref={chatRef}
            className="flex-1 p-3 space-y-2 overflow-y-auto max-h-80 bg-gray-50"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-xl text-sm max-w-[75%] ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-sm text-gray-500">Typing...</div>
            )}
          </div>

          {/* Input */}
          <div className="p-2 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none"
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-4 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FAQChatWidget;