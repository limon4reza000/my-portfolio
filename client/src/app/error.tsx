'use client';

/** Shown when the API is unreachable or returns an error. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="card max-w-md p-8 text-center">
        <p className="font-mono text-[12px] uppercase tracking-label text-danger">Something went wrong</p>
        <h1 className="mt-4 font-display text-[28px] font-semibold tracking-tight3">Couldn’t load the portfolio</h1>
        <p className="mt-3 text-[15px] text-muted">
          The API server may be offline. Make sure the backend is running on <code className="text-fg">API_URL</code> and the database is seeded.
        </p>
        {process.env.NODE_ENV !== 'production' && <p className="mt-3 font-mono text-[12px] text-muted">{error.message}</p>}
        <button onClick={reset} className="btn-primary mt-6">
          Try again
        </button>
      </div>
    </main>
  );
}
