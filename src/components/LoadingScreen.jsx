import { HeartHandshake } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <main className="screen grid place-items-center">
      <div className="text-center" role="status" aria-live="polite">
        <span className="mx-auto mb-4 grid h-14 w-14 animate-pulse place-items-center rounded-2xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-100"><HeartHandshake className="h-7 w-7" /></span>
        <p className="text-sm font-semibold text-muted">Carregando Casa Clara...</p>
      </div>
    </main>
  );
}
