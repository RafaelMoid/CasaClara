import { useState } from 'react';
import { CreditCard, Landmark, Plus, Wallet } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { useFinance } from '../contexts/FinanceContext.jsx';
import { formatCurrency } from '../utils/formatters.js';

function iconFor(type) {
  if (type.toLowerCase().includes('cartao')) return CreditCard;
  if (type.toLowerCase().includes('carteira')) return Wallet;
  return Landmark;
}

export default function Accounts() {
  const { accounts, profile, addAccount, t } = useFinance();
  const [form, setForm] = useState({ name: '', type: '', balance: '' });

  const submit = (event) => {
    event.preventDefault();
    addAccount(form);
    setForm({ name: '', type: '', balance: '' });
  };

  return (
    <>
      <PageHeader title={t.accounts} subtitle="Gerencie saldos por conta" />
      <div className="space-y-3">
        {accounts.map((account) => {
          const Icon = iconFor(account.type);
          return (
            <article className="card flex items-center gap-3" key={account.id}>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-100">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-bold">{account.name}</h2>
                <p className="text-xs text-slate-500">{account.type}</p>
              </div>
              <strong className={account.balance < 0 ? 'text-sm font-bold text-expense' : 'text-sm font-bold text-income'}>
                {formatCurrency(account.balance, profile.currency, profile.language)}
              </strong>
            </article>
          );
        })}
      </div>

      <form className="card mt-4" onSubmit={submit}>
        <h2 className="mb-3 text-sm font-bold">Nova conta</h2>
        <input className="input mb-3" placeholder="Nome" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        <input className="input mb-3" placeholder="Tipo" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} required />
        <input className="input mb-3" inputMode="decimal" type="number" step="0.01" placeholder="Saldo atual" value={form.balance} onChange={(event) => setForm({ ...form, balance: event.target.value })} required />
        <button className="button-primary w-full"><Plus className="h-4 w-4" /> Nova Conta</button>
      </form>
    </>
  );
}
