import { HeartHandshake } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <main className="screen grid place-items-center">
      <div className="text-center">
        <HeartHandshake className="mx-auto mb-3 h-10 w-10 text-brand-600" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Carregando Casa Clara...</p>
      </div>
    </main>
  );
}
