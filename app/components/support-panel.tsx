"use client";

import { useState } from "react";

interface SupportPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function SupportPanel({ isOpen, onToggle }: SupportPanelProps) {
  const [formData, setFormData] = useState({ message: "" });
  const [messages, setMessages] = useState<Array<{ role: "user" | "support"; content: string }>>([
    { role: "support", content: "Hi! Need help with anything? Send a message and I'll get back to you." }
  ]);
  const [status, setStatus] = useState<"idle" | "sending">("idle");

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
        content: "Thanks! I've received your message and will respond via email soon."
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "support",
        content: "Something went wrong. Please try again or email directly."
      }]);
    } finally {
      setStatus("idle");
    }
  };

  // Collapsed state - floating button
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="hidden lg:flex fixed right-6 bottom-6 w-12 h-12 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-full items-center justify-center shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    );
  }

  // Expanded state - full panel
  return (
    <aside className="hidden lg:flex w-80 bg-[#0a0a0a] border-l border-[#262626] flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-[#262626] flex justify-between items-center">
        <div>
          <h3 className="text-[#fafafa] font-medium">Support</h3>
          <p className="text-xs text-[#737373]">We're here to help</p>
        </div>
        <button
          onClick={onToggle}
          className="p-2 text-[#737373] hover:text-[#fafafa] hover:bg-[#1a1a1a] rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
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
              className={`max-w-[85%] p-3 rounded-xl text-sm ${
                msg.role === "user"
                  ? "bg-[#3b82f6] text-white"
                  : "bg-[#1a1a1a] text-[#a1a1a1] border border-[#262626]"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-[#262626]">
        <div className="flex gap-2">
          <input
            type="text"
            value={formData.message}
            onChange={(e) => setFormData({ message: e.target.value })}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 bg-[#141414] border border-[#262626] rounded-lg text-sm text-[#fafafa] placeholder-[#525252] focus:border-[#3b82f6] focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={status === "sending" || !formData.message.trim()}
            className="px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] disabled:bg-[#262626] disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </aside>
  );
}
