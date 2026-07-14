import { useNavigate } from 'react-router-dom';
import { HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <main className="screen">
      <div className="app-shell justify-between px-6 py-8">
        <section className="text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Casa Clara</p>
          <h1 className="font-serif text-4xl font-bold text-slate-950 dark:text-white">Financas em harmonia, sonhos em comum.</h1>
          <div className="mx-auto my-8 grid h-64 w-full max-w-xs place-items-center rounded-[2rem] bg-brand-50 dark:bg-slate-800">
            <div className="relative h-44 w-44">
              <div className="absolute left-3 top-10 h-28 w-20 rounded-full bg-emerald-600" />
              <div className="absolute right-3 top-8 h-32 w-24 rounded-full bg-slate-700" />
              <div className="absolute left-8 top-2 h-16 w-16 rounded-full bg-amber-200" />
              <div className="absolute right-12 top-0 h-16 w-16 rounded-full bg-amber-300" />
              <HeartHandshake className="absolute bottom-0 left-1/2 h-20 w-20 -translate-x-1/2 text-brand-600" />
            </div>
          </div>
          <p className="mx-auto max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-300">
            Organizem receitas, despesas, metas e contas em um unico app local, leve e acolhedor.
          </p>
        </section>

        <section className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300">
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-mint" /> Dados locais</span>
            <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-amberSoft" /> Mobile first</span>
          </div>
          <button className="button-primary w-full" onClick={() => navigate('/terms')}>Comecar</button>
          <div className="flex justify-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-brand-600" />
            <span className="h-2 w-2 rounded-full bg-slate-300" />
            <span className="h-2 w-2 rounded-full bg-slate-300" />
          </div>
        </section>
      </div>
    </main>
  );
}
