"use client";

import { useState } from "react";

interface SupportPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  userEmail?: string;
}

export function SupportPanel({ isOpen, onToggle, userEmail }: SupportPanelProps) {
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
          email: userEmail || "via-chat@support.local",
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

  // Collapsed state - floating "?" button
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="flex fixed right-6 bottom-6 w-11 h-11 bg-white border border-[#e5e7eb] text-[#9ca3af] hover:text-[#4b5563] hover:border-[#d1d5db] hover:shadow-sm rounded-full items-center justify-center transition-all z-40 text-[16px] font-medium"
      >
        ?
      </button>
    );
  }

  // Expanded state - always overlay
  return (
    <aside className="fixed inset-0 lg:inset-auto lg:right-0 lg:top-0 lg:bottom-0 z-50 flex w-full lg:w-80 bg-white lg:border-l border-[#f3f4f6] flex-col lg:h-screen lg:shadow-lg">
      {/* Header */}
      <div className="p-5 border-b border-[#f3f4f6] flex justify-between items-center">
        <div>
          <h3 className="text-[15px] font-medium text-[#111827]">Support</h3>
          <p className="text-[12px] text-[#9ca3af]">We're here to help</p>
        </div>
        <button
          onClick={onToggle}
          className="p-2 text-[#9ca3af] hover:text-[#4b5563] hover:bg-[#f9fafb] rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-xl text-[14px] ${
                msg.role === "user"
                  ? "bg-[#f3f4f6] text-[#111827]"
                  : "bg-[#f9fafb] text-[#4b5563]"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-[#f3f4f6]">
        <div className="flex gap-2">
          <input
            type="text"
            value={formData.message}
            onChange={(e) => setFormData({ message: e.target.value })}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-[14px] text-[#111827] placeholder-[#d1d5db] focus:border-[#d1d5db] focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={status === "sending" || !formData.message.trim()}
            className="px-4 py-2 bg-[#111827] hover:bg-[#374151] disabled:bg-[#e5e7eb] disabled:cursor-not-allowed text-white text-[14px] font-medium rounded-lg transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </aside>
  );
}
