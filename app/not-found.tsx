export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-[60px] font-semibold text-[#f3f4f6] mb-4">404</p>
        <h1 className="text-[22px] font-semibold text-[#111827] mb-2">
          Page not found
        </h1>
        <p className="text-[15px] text-[#9ca3af] mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <a
          href="/home"
          className="inline-flex px-5 py-2.5 bg-[#111827] hover:bg-[#374151] text-white text-[14px] font-medium rounded-lg transition-colors"
        >
          Go to Dashboard
        </a>
      </div>
    </main>
  );
}
