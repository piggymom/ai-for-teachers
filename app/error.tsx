"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 bg-[#fef2f2] rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-[#ef4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-[22px] font-semibold text-[#111827] mb-2">
          Something went wrong
        </h1>
        <p className="text-[15px] text-[#9ca3af] mb-6">
          An unexpected error occurred. Your progress has been saved.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-[#111827] hover:bg-[#374151] text-white text-[14px] font-medium rounded-lg transition-colors"
          >
            Try again
          </button>
          <a
            href="/home"
            className="px-5 py-2.5 border border-[#e5e7eb] hover:bg-[#f9fafb] text-[#111827] text-[14px] font-medium rounded-lg transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}
