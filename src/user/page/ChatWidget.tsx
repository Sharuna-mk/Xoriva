import { useState } from "react";
import Chat from "./Chat";

function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-black text-white p-4 rounded-full shadow-lg z-50"
      >
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-5 w-[350px] h-[500px] bg-white shadow-xl rounded-xl z-50 flex flex-col overflow-hidden">

          {/* Header */}
          <div className="bg-black text-white p-3 flex justify-between items-center">
            <span>AI Assistant</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          {/* Chat */}
          <div className="flex-1">
            <Chat />
          </div>
        </div>
      )}
    </>
  );
}

export default ChatWidget;