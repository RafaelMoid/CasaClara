import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowDownCircle, ArrowUpCircle, BarChart3, ChartPie, ListFilter, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import CollapsibleSection from '../components/CollapsibleSection.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import TransactionItem from '../components/TransactionItem.jsx';
import ModalSelect from '../components/ModalSelect.jsx';
import { categories } from '../data/seed.js';
import { useFinance } from '../contexts/FinanceContext.jsx';
import { formatCurrency } from '../utils/formatters.js';
import { getBarData, getCategoryTotals, getMonthKey, getMonthlyTransactions, getTotals } from '../utils/finance.js';
import { chartPastels } from '../config/categoryVisuals.js';

const colors = chartPastels;
const tooltipStyle = { border: '1px solid rgb(var(--color-border))', borderRadius: 12, background: 'rgb(var(--color-surface-elevated))', color: 'rgb(var(--color-text-primary))', boxShadow: '0 8px 24px rgba(20,30,24,.08)' };
const PAGE_SIZE = 5;
const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' });

function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split('-');
  const label = monthFormatter.format(new Date(Date.UTC(Number(year), Number(month) - 1, 1)));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export default function Dashboard() {
  const { profile, activeFamily, activeUser, userFamilies, accounts, transactions, switchFamily, t } = useFinance();
  const [filters, setFilters] = useState({ type: 'all', category: 'all' });
  const monthOptions = useMemo(() => {
    const options = [...new Set(transactions.map((transaction) => transaction.date?.slice(0, 7)).filter(Boolean))]
      .sort((a, b) => b.localeCompare(a))
      .map((monthKey) => ({ value: monthKey, label: formatMonthLabel(monthKey) }));
    const currentMonth = getMonthKey();
    return options.length ? options : [{ value: currentMonth, label: formatMonthLabel(currentMonth) }];
  }, [transactions]);
  const [selectedMonth, setSelectedMonth] = useState(getMonthKey());
  const [selectedTransactionMonth, setSelectedTransactionMonth] = useState(getMonthKey());
  const [transactionPage, setTransactionPage] = useState(1);

  useEffect(() => {
    const selectedMonthHasTransactions = transactions.some((transaction) => transaction.date?.startsWith(selectedMonth));
    const selectedMonthExists = monthOptions.some((option) => option.value === selectedMonth);
    if ((!selectedMonthExists || !selectedMonthHasTransactions) && monthOptions[0]?.value) {
      setSelectedMonth(monthOptions[0].value);
    }
  }, [monthOptions, selectedMonth, transactions]);

  useEffect(() => {
    const selectedMonthHasTransactions = transactions.some((transaction) => transaction.date?.startsWith(selectedTransactionMonth));
    const selectedMonthExists = monthOptions.some((option) => option.value === selectedTransactionMonth);
    if ((!selectedMonthExists || !selectedMonthHasTransactions) && monthOptions[0]?.value) {
      setSelectedTransactionMonth(monthOptions[0].value);
    }
  }, [monthOptions, selectedTransactionMonth, transactions]);

  useEffect(() => {
    setTransactionPage(1);
  }, [filters, selectedTransactionMonth]);

  const monthTransactions = getMonthlyTransactions(transactions, selectedMonth);
  const totals = getTotals(monthTransactions);
  const accountBalance = accounts.reduce((sum, account) => sum + Number(account.balance || 0), 0);
  const pieData = getCategoryTotals(monthTransactions, 'expense');
  const categoryOptions = [
    { value: 'all', label: 'Todas categorias' },
    ...[...categories.income, ...categories.expense].map((category) => ({ value: category, label: category }))
  ];
  const familyOptions = userFamilies.length
    ? userFamilies.map((family) => ({ value: family.id, label: family.name }))
    : activeFamily
      ? [{ value: activeFamily.id, label: activeFamily.name }]
      : [];
  const latestTransactions = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.date?.startsWith(selectedTransactionMonth))
      .filter((transaction) => filters.type === 'all' || transaction.type === filters.type)
      .filter((transaction) => filters.category === 'all' || transaction.category === filters.category)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [filters, selectedTransactionMonth, transactions]);
  const totalPages = Math.max(1, Math.ceil(latestTransactions.length / PAGE_SIZE));
  const currentPage = Math.min(transactionPage, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const visibleTransactions = latestTransactions.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <>
      <PageHeader
        title={`${t.hello}, ${activeUser?.name || activeFamily?.name}!`}
        subtitle={`${activeFamily?.name || 'Familia'} - ${formatMonthLabel(selectedMonth)}`}
      />

      <div className="mb-3 grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2">
        <ModalSelect
          label="Familia"
          value={activeFamily?.id || ''}
          options={familyOptions}
          onChange={switchFamily}
        />
        <ModalSelect label="Periodo do resumo" value={selectedMonth} options={monthOptions} onChange={setSelectedMonth} />
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-3">
        <StatCard title={t.income} value={totals.income} tone="green" icon={ArrowUpCircle} />
        <StatCard title={t.expense} value={totals.expense} tone="red" icon={ArrowDownCircle} />
        <StatCard title={t.balance} value={accountBalance} tone="blue" icon={Wallet} />
      </div>

      <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)]">
        <CollapsibleSection
          title="Resumo do mes"
          subtitle="Receitas vs Despesas"
          icon={BarChart3}
          storageKey="casa-clara-section-month-summary"
          action={
            <div className="hidden text-right text-xs font-bold leading-5 sm:block">
              <p className="text-income">{formatCurrency(totals.income, profile.currency, profile.language)}</p>
              <p className="text-expense">{formatCurrency(totals.expense, profile.currency, profile.language)}</p>
            </div>
          }
        >
          <div className="mb-3 grid grid-cols-2 gap-2 sm:hidden">
            <div className="rounded-xl bg-emerald-50 p-3 text-xs font-bold text-income dark:bg-emerald-950/70">
              <span className="block text-[11px] font-semibold">Receitas</span>
              {formatCurrency(totals.income, profile.currency, profile.language)}
            </div>
            <div className="rounded-xl bg-red-50 p-3 text-xs font-bold text-expense dark:bg-red-950/70">
              <span className="block text-[11px] font-semibold">Despesas</span>
              {formatCurrency(totals.expense, profile.currency, profile.language)}
            </div>
          </div>
          <div className="min-w-0 overflow-hidden h-56 lg:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getBarData(monthTransactions)}>
                <CartesianGrid stroke="rgb(var(--color-border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgb(var(--color-text-secondary))' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgb(var(--color-text-secondary))' }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="Receitas" fill="#78c7a2" radius={[8, 8, 2, 2]} />
                <Bar dataKey="Despesas" fill="#e8a0a0" radius={[8, 8, 2, 2]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Top categorias" icon={ChartPie} storageKey="casa-clara-section-top-categories">
          <div className="grid min-w-0 grid-cols-[minmax(0,120px)_minmax(0,1fr)] items-center gap-3 xl:grid-cols-1">
            <div className="min-w-0 overflow-hidden h-28 xl:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={24} outerRadius={52}>
                    {pieData.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="min-w-0 space-y-2">
              {pieData.slice(0, 5).map((item, index) => (
                <div className="flex min-w-0 items-center justify-between gap-2 text-xs" key={item.name}>
                  <span className="flex min-w-0 items-center gap-2 truncate"><span className="h-2 w-2 shrink-0 rounded-full" style={{ background: colors[index % colors.length] }} />{item.name}</span>
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
        <div className="mb-3 grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-3">
          <ModalSelect
            label="Mes"
            value={selectedTransactionMonth}
            options={monthOptions}
            onChange={setSelectedTransactionMonth}
          />
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
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-500">
          <span>
            Mostrando {latestTransactions.length ? pageStart + 1 : 0}-{Math.min(pageStart + visibleTransactions.length, latestTransactions.length)} de {latestTransactions.length} transacoes
          </span>
          <span>Pagina {currentPage} de {totalPages}</span>
        </div>
        <div className="space-y-2 rounded-2xl bg-surface-secondary p-2">
          {visibleTransactions.map((transaction) => <TransactionItem key={transaction.id} transaction={transaction} />)}
          {visibleTransactions.length === 0 ? <p className="rounded-xl bg-surface p-6 text-center text-sm text-muted">Nenhuma transação encontrada.</p> : null}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            className="button-secondary justify-center disabled:cursor-not-allowed disabled:opacity-50"
            disabled={currentPage <= 1}
            onClick={() => setTransactionPage((page) => Math.max(1, page - 1))}
          >
            Anterior
          </button>
          <button
            type="button"
            className="button-secondary justify-center disabled:cursor-not-allowed disabled:opacity-50"
            disabled={currentPage >= totalPages}
            onClick={() => setTransactionPage((page) => Math.min(totalPages, page + 1))}
          >
            Proxima
          </button>
        </div>
      </CollapsibleSection>
    </>
  );
}
