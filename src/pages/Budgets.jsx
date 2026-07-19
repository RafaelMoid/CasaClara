import { useState } from 'react';
import { Plus } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { categories } from '../data/seed.js';
import { useFinance } from '../contexts/FinanceContext.jsx';
import { formatCurrency } from '../utils/formatters.js';
import { getCategoryTotals } from '../utils/finance.js';

export default function Budgets() {
  const { budgets, transactions, profile, familyMembers, activeUser, addBudget, t } = useFinance();
  const [form, setForm] = useState({ name: '', category: 'Alimentacao', assignedUserId: activeUser?.id || '', limit: '' });
  const spentByCategory = getCategoryTotals(transactions, 'expense');

  const spentFor = (category) => spentByCategory.find((item) => item.name === category)?.value || 0;
  const userName = (userId) => familyMembers.find((member) => member.userId === userId)?.user.name || 'Familia';

  const submit = (event) => {
    event.preventDefault();
    addBudget(form);
    setForm({ name: '', category: 'Alimentacao', assignedUserId: activeUser?.id || '', limit: '' });
  };

  return (
    <>
      <PageHeader title={t.budgets} subtitle="Defina limites por categoria" />
      <div className="space-y-3">
        {budgets.map((budget) => {
          const spent = spentFor(budget.category);
          const percent = Math.min((spent / budget.limit) * 100, 100);
          return (
            <article className="card" key={budget.id}>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold">{budget.name}</h2>
                  <p className="text-xs text-slate-500">
                    {budget.category} · Responsavel: {userName(budget.assignedUserId)}
                  </p>
                  <p className="text-xs text-slate-500">{formatCurrency(spent, profile.currency, profile.language)} gastos</p>
                </div>
                <strong className="text-sm">{formatCurrency(budget.limit, profile.currency, profile.language)}</strong>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-2 rounded-full bg-mint" style={{ width: `${percent}%` }} />
              </div>
              <p className="mt-2 text-right text-xs font-semibold text-slate-500">{Math.round(percent)}%</p>
            </article>
          );
        })}
      </div>

      <form className="card mt-4" onSubmit={submit}>
        <h2 className="mb-3 text-sm font-bold">Novo orcamento</h2>
        <label className="label">Nome do orcamento</label>
        <input className="input mb-3" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ex. Mercado do mes" required />
        <label className="label">Categoria</label>
        <select className="input mb-3" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
          {categories.expense.map((category) => <option key={category}>{category}</option>)}
        </select>
        <label className="label">Responsavel</label>
        <select className="input mb-3" value={form.assignedUserId} onChange={(event) => setForm({ ...form, assignedUserId: event.target.value })} required>
          {familyMembers.map((member) => <option key={member.userId} value={member.userId}>{member.user.name}</option>)}
        </select>
        <label className="label">Limite mensal</label>
        <input className="input mb-3" type="number" min="0" step="0.01" placeholder="Limite mensal" value={form.limit} onChange={(event) => setForm({ ...form, limit: event.target.value })} required />
        <button className="button-primary w-full"><Plus className="h-4 w-4" /> Novo Orcamento</button>
      </form>
    </>
  );
}
