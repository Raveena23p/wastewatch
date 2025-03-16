"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send } from "lucide-react";

export default function Aichatmodal() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: "user" }[]>([]);
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    setInput(""); // Clear input after sending
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* Floating AI Chat Icon */}
      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={() => setIsOpen(false)} // Close when clicking outside
        >
          <div className="bg-white rounded-lg shadow-lg w-80" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex justify-between items-center p-3 bg-blue-600 text-white rounded-t-lg">
              <h3 className="text-lg font-semibold">AI Chat</h3>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div ref={chatRef} className="p-3 h-64 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-sm text-center">Start a conversation...</p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`p-2 ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"} rounded-lg mb-2`}>
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Box */}
            <div className="p-3 flex border-t bg-gray-100">
              <input
                type="text"
                className="flex-grow p-2 border rounded-lg focus:outline-none"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                className="ml-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                onClick={handleSend}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
