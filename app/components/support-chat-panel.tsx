"use client";

import { useState } from "react";

export function SupportChatPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    message: ""
  });
  const [messages, setMessages] = useState<Array<{role: "user" | "support", content: string}>>([
    { role: "support", content: "Hi there! Need help with anything? Send a message and we'll get back to you." }
  ]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    const userMessage = formData.message;
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setFormData({ message: "" });
    setStatus("sending");

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Support Chat User",
          email: "via-chat@support.local",
          message: userMessage
        })
      });

      setMessages(prev => [...prev, {
        role: "support",
        content: "Thanks for your message! We'll get back to you via email soon."
      }]);
      setStatus("sent");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("idle");
    }
  };

  // Collapsed state - just a tab/button
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="hidden lg:block fixed right-0 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-white/10 text-white/70 px-2 py-4 rounded-l-lg border border-r-0 border-white/10 transition-colors"
        style={{ writingMode: "vertical-rl" }}
      >
        Need Help?
      </button>
    );
  }

  // Expanded state - full chat panel
  return (
    <aside className="hidden lg:flex w-80 bg-neutral-900 border-l border-white/10 flex-col h-screen fixed right-0 top-0">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <div>
          <h3 className="text-white font-medium">Support</h3>
          <p className="text-xs text-white/50">We're here to help</p>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-white/40 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg text-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 text-white/80"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={formData.message}
            onChange={(e) => setFormData({ message: e.target.value })}
            placeholder="Type your message..."
            className="flex-1 p-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === "sending" || !formData.message.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-white/10 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </aside>
  );
}
