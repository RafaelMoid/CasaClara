import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Save } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { categories, paymentMethods } from '../data/seed.js';
import { useFinance } from '../contexts/FinanceContext.jsx';

const emptyTransaction = {
  type: 'expense',
  category: 'Alimentacao',
  description: '',
  value: '',
  date: new Date().toISOString().slice(0, 10),
  account: 'Conta Conjunta',
  paymentMethod: 'Debito',
  recurring: false
};

function createEmptyTransaction(accounts) {
  return {
    ...emptyTransaction,
    account: accounts[0]?.name || ''
  };
}

export default function TransactionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accounts, transactions, addTransaction, updateTransaction, t } = useFinance();
  const editing = transactions.find((transaction) => transaction.id === id);
  const [form, setForm] = useState(editing || createEmptyTransaction(accounts));
  const availableCategories = useMemo(() => categories[form.type], [form.type]);

  useEffect(() => {
    if (editing || form.account || !accounts[0]?.name) return;
    setForm((current) => ({ ...current, account: accounts[0].name }));
  }, [accounts, editing, form.account]);

  const setField = (field, value) => {
    const next = { ...form, [field]: value };
    if (field === 'type') next.category = categories[value][0];
    setForm(next);
  };

  const submit = (event) => {
    event.preventDefault();
    if (editing) updateTransaction(editing.id, form);
    else addTransaction(form);
    navigate('/transactions');
  };

  return (
    <>
      <PageHeader
        title={editing ? 'Editar Transacao' : t.newTransaction}
        action={<button className="button-secondary h-10 w-10 p-0" onClick={() => navigate(-1)}><ChevronLeft className="h-4 w-4" /></button>}
      />
      <form className="space-y-4" onSubmit={submit}>
        <section className="card">
          <label className="label">Tipo</label>
          <div className="mb-4 grid grid-cols-2 rounded-xl bg-surface-secondary p-1">
            {['income', 'expense'].map((type) => (
              <button
                type="button"
                key={type}
                className={`h-10 rounded-lg text-sm font-semibold transition ${form.type === type ? 'bg-surface text-brand-700 shadow-sm dark:text-brand-100' : 'text-muted'}`}
                onClick={() => setField('type', type)}
              >
                {type === 'income' ? 'Receita' : 'Despesa'}
              </button>
            ))}
          </div>

          <label className="label">Categoria</label>
          <select className="input mb-4" value={form.category} onChange={(event) => setField('category', event.target.value)}>
            {availableCategories.map((category) => <option key={category}>{category}</option>)}
          </select>

          <label className="label">Descricao</label>
          <input className="input mb-4" value={form.description} onChange={(event) => setField('description', event.target.value)} placeholder="Ex. Almoco com amigos" required />

          <label className="label">Valor</label>
          <input className="input mb-4" inputMode="decimal" type="number" min="0" step="0.01" value={form.value} onChange={(event) => setField('value', event.target.value)} required />

          <label className="label">Data</label>
          <input className="input mb-4" type="date" value={form.date} onChange={(event) => setField('date', event.target.value)} required />

          <label className="label">Conta</label>
          <select className="input mb-4" value={form.account} onChange={(event) => setField('account', event.target.value)} required>
            {accounts.map((account) => <option key={account.id}>{account.name}</option>)}
          </select>
          {!accounts.length ? <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm font-semibold text-amber-700">Crie uma conta antes de cadastrar transacoes.</p> : null}

          <label className="label">Forma de pagamento</label>
          <select className="input mb-4" value={form.paymentMethod} onChange={(event) => setField('paymentMethod', event.target.value)}>
            {paymentMethods.map((method) => <option key={method}>{method}</option>)}
          </select>

          <label className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm font-semibold dark:bg-slate-800">
            Recorrente?
            <input className="h-5 w-5 accent-brand-600" type="checkbox" checked={form.recurring} onChange={(event) => setField('recurring', event.target.checked)} />
          </label>
        </section>
        <button className="button-primary w-full" disabled={!accounts.length}><Save className="h-4 w-4" /> {t.save}</button>
      </form>
    </>
  );
}
