import { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { useFinance } from '../contexts/FinanceContext.jsx';
import { formatCurrency } from '../utils/formatters.js';

export default function Goals() {
  const { goals, profile, addGoal, t } = useFinance();
  const [form, setForm] = useState({ name: '', target: '', current: '', date: '' });

  const submit = (event) => {
    event.preventDefault();
    addGoal(form);
    setForm({ name: '', target: '', current: '', date: '' });
  };

  return (
    <>
      <PageHeader title={t.goals} subtitle="Acompanhe sonhos compartilhados" />
      <div className="space-y-3">
        {goals.map((goal) => {
          const percent = Math.min((goal.current / goal.target) * 100, 100);
          return (
            <article className="card flex gap-3" key={goal.id}>
              <div className="grid h-14 w-14 place-items-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950">
                <Target className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-bold">{goal.name}</h2>
                    <p className="text-xs text-slate-500">Ate {goal.date}</p>
                  </div>
                  <strong className="text-xs">{Math.round(percent)}%</strong>
                </div>
                <p className="mb-2 text-xs text-slate-500">
                  {formatCurrency(goal.current, profile.currency, profile.language)} de {formatCurrency(goal.target, profile.currency, profile.language)}
                </p>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-2 rounded-full bg-brand-600" style={{ width: `${percent}%` }} />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <form className="card mt-4" onSubmit={submit}>
        <h2 className="mb-3 text-sm font-bold">Nova meta</h2>
        <input className="input mb-3" placeholder="Nome da meta" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        <input className="input mb-3" type="number" min="0" step="0.01" placeholder="Valor alvo" value={form.target} onChange={(event) => setForm({ ...form, target: event.target.value })} required />
        <input className="input mb-3" type="number" min="0" step="0.01" placeholder="Valor atual" value={form.current} onChange={(event) => setForm({ ...form, current: event.target.value })} required />
        <input className="input mb-3" type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} required />
        <button className="button-primary w-full"><Plus className="h-4 w-4" /> Nova Meta</button>
      </form>
    </>
  );
}
