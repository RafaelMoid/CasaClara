import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowDownCircle, ArrowUpCircle, BarChart3, CalendarDays, ChartPie, ListFilter, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import CollapsibleSection from '../components/CollapsibleSection.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import TransactionItem from '../components/TransactionItem.jsx';
import ModalSelect from '../components/ModalSelect.jsx';
import { categories } from '../data/seed.js';
import { useFinance } from '../contexts/FinanceContext.jsx';
import { formatCurrency } from '../utils/formatters.js';
import { getBarData, getCategoryTotals, getMonthlyTransactions, getTotals } from '../utils/finance.js';

const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#64748b'];

export default function Dashboard() {
  const { profile, activeFamily, activeUser, transactions, t } = useFinance();
  const [filters, setFilters] = useState({ type: 'all', category: 'all' });
  const monthTransactions = getMonthlyTransactions(transactions);
  const totals = getTotals(monthTransactions);
  const pieData = getCategoryTotals(monthTransactions, 'expense');
  const categoryOptions = [
    { value: 'all', label: 'Todas categorias' },
    ...[...categories.income, ...categories.expense].map((category) => ({ value: category, label: category }))
  ];
  const latestTransactions = useMemo(() => {
    return transactions
      .filter((transaction) => filters.type === 'all' || transaction.type === filters.type)
      .filter((transaction) => filters.category === 'all' || transaction.category === filters.category);
  }, [filters, transactions]);
  const visibleTransactions = latestTransactions.slice(0, 20);

  return (
    <>
      <PageHeader title={`${t.hello}, ${activeUser?.name || activeFamily?.name}!`} subtitle={`${activeFamily?.name || 'Familia'} · Julho 2026`} action={<CalendarDays className="h-5 w-5 text-slate-400" />} />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <StatCard title={t.income} value={totals.income} tone="green" icon={ArrowUpCircle} />
        <StatCard title={t.expense} value={totals.expense} tone="red" icon={ArrowDownCircle} />
        <StatCard title={t.balance} value={totals.balance} tone="blue" icon={Wallet} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.35fr_0.9fr]">
        <CollapsibleSection
          title="Resumo do mes"
          subtitle="Receitas vs Despesas"
          icon={BarChart3}
          storageKey="casa-clara-section-month-summary"
          action={
            <div className="hidden text-right text-xs font-bold leading-5 sm:block">
              <p className="text-emerald-600">{formatCurrency(totals.income, profile.currency, profile.language)}</p>
              <p className="text-red-600">{formatCurrency(totals.expense, profile.currency, profile.language)}</p>
            </div>
          }
        >
          <div className="mb-3 grid grid-cols-2 gap-2 sm:hidden">
            <div className="rounded-lg bg-emerald-50 p-3 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <span className="block text-[11px] font-semibold">Receitas</span>
              {formatCurrency(totals.income, profile.currency, profile.language)}
            </div>
            <div className="rounded-lg bg-red-50 p-3 text-xs font-bold text-red-700 dark:bg-red-950 dark:text-red-300">
              <span className="block text-[11px] font-semibold">Despesas</span>
              {formatCurrency(totals.expense, profile.currency, profile.language)}
            </div>
          </div>
          <div className="h-56 lg:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getBarData(monthTransactions)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="Receitas" fill="#10b981" radius={[6, 6, 0, 0]} label={{ position: 'top', fontSize: 10, fill: '#047857' }} />
                <Bar dataKey="Despesas" fill="#ef4444" radius={[6, 6, 0, 0]} label={{ position: 'top', fontSize: 10, fill: '#dc2626' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Top categorias" icon={ChartPie} storageKey="casa-clara-section-top-categories">
          <div className="grid grid-cols-[120px_1fr] items-center gap-3 xl:grid-cols-1">
            <div className="h-28 xl:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={24} outerRadius={52}>
                    {pieData.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {pieData.slice(0, 5).map((item, index) => (
                <div className="flex items-center justify-between text-xs" key={item.name}>
                  <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: colors[index % colors.length] }} />{item.name}</span>
                  <strong>{Math.round((item.value / Math.max(totals.expense, 1)) * 100)}%</strong>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleSection>
      </div>

      <CollapsibleSection
        title={t.recentTransactions}
        icon={ListFilter}
        className="mt-4"
        storageKey="casa-clara-section-latest-transactions"
        action={<Link className="inline-flex h-11 items-center rounded-lg px-2 text-sm font-semibold text-brand-600 active:bg-brand-50 dark:active:bg-brand-950" to="/transactions">Ver todas</Link>}
      >
        <div className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
          <ModalSelect
            label="Tipo"
            value={filters.type}
            options={[
              { value: 'all', label: 'Todos' },
              { value: 'income', label: 'Receitas' },
              { value: 'expense', label: 'Despesas' }
            ]}
            onChange={(value) => setFilters({ ...filters, type: value })}
          />
          <ModalSelect
            label="Categoria"
            value={filters.category}
            options={categoryOptions}
            onChange={(value) => setFilters({ ...filters, category: value })}
          />
        </div>
        <p className="mb-2 text-xs font-semibold text-slate-500">
          Mostrando {visibleTransactions.length} de {latestTransactions.length} transacoes filtradas
        </p>
        <div className="h-[520px] space-y-2 overflow-y-auto overscroll-contain rounded-lg bg-slate-50 p-2 lg:h-[440px] dark:bg-slate-950">
          {visibleTransactions.map((transaction) => <TransactionItem key={transaction.id} transaction={transaction} />)}
          {visibleTransactions.length === 0 ? <p className="rounded-lg bg-white p-4 text-center text-sm text-slate-500 dark:bg-slate-900">Nenhuma transacao encontrada.</p> : null}
        </div>
      </CollapsibleSection>
    </>
  );
}
