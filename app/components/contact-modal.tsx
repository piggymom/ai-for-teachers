"use client";

import { useState } from "react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus("sent");
        setFormData({ name: "", email: "", message: "" });
        // Auto-close after 2 seconds
        setTimeout(() => {
          onClose();
          setStatus("idle");
        }, 2000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white border border-[#e5e7eb] rounded-xl p-6 w-full max-w-md mx-4 shadow-sm">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#d1d5db] hover:text-[#4b5563] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-[18px] font-medium text-[#111827] mb-2">Contact Support</h2>
        <p className="text-[13px] text-[#9ca3af] mb-6">
          Having technical issues or questions about the course? Send us a message and we&apos;ll get back to you.
        </p>

        {status === "sent" ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 bg-[#10b981]/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-[#10b981] font-medium text-[15px]">Message sent!</p>
            <p className="text-[#9ca3af] text-[13px] mt-1">We&apos;ll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-[#111827] mb-1.5">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full p-3 bg-white border border-[#e5e7eb] rounded-lg text-[14px] text-[#111827] placeholder-[#d1d5db] focus:border-[#d1d5db] focus:outline-none transition"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#111827] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full p-3 bg-white border border-[#e5e7eb] rounded-lg text-[14px] text-[#111827] placeholder-[#d1d5db] focus:border-[#d1d5db] focus:outline-none transition"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#111827] mb-1.5">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={4}
                className="w-full p-3 bg-white border border-[#e5e7eb] rounded-lg text-[14px] text-[#111827] placeholder-[#d1d5db] focus:border-[#d1d5db] focus:outline-none resize-none transition"
                placeholder="Describe your issue or question..."
              />
            </div>

            {status === "error" && (
              <p className="text-[#ef4444] text-[13px]">
                Something went wrong. Please try again or email directly.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-2.5 bg-[#111827] hover:bg-[#374151] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[14px] font-medium rounded-lg transition-colors"
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
