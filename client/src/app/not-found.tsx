import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-[120px] font-semibold leading-none tracking-tightest text-ghost">404</p>
      <h1 className="mt-4 font-display text-[28px] font-semibold tracking-tight3">This page doesn’t exist.</h1>
      <Link href="/" className="btn-primary mt-8">
        Back home
      </Link>
    </main>
  );
}
