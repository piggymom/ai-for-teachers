export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-md animate-fade-in-up">
        <p className="text-[60px] font-semibold text-muted/80 mb-4">404</p>
        <h1 className="text-[22px] font-semibold text-foreground mb-2">
          Page not found
        </h1>
        <p className="text-[15px] text-muted-foreground mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <a
          href="/home"
          className="inline-flex px-5 py-2.5 bg-primary hover:opacity-90 text-primary-foreground text-[14px] font-medium rounded-lg transition-colors shadow-sm"
        >
          Go to Dashboard
        </a>
      </div>
    </main>
  );
}
