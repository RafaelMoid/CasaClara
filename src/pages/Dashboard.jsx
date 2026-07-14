import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowDownCircle, ArrowUpCircle, CalendarDays, Wallet } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import TransactionItem from '../components/TransactionItem.jsx';
import { useFinance } from '../contexts/FinanceContext.jsx';
import { getBarData, getCategoryTotals, getMonthlyTransactions, getTotals } from '../utils/finance.js';

const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#64748b'];

export default function Dashboard() {
  const { profile, transactions, t } = useFinance();
  const monthTransactions = getMonthlyTransactions(transactions);
  const totals = getTotals(monthTransactions);
  const pieData = getCategoryTotals(monthTransactions, 'expense');

  return (
    <>
      <PageHeader title={`${t.hello}, ${profile.coupleName}!`} subtitle="Julho 2026" action={<CalendarDays className="h-5 w-5 text-slate-400" />} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard title={t.income} value={totals.income} tone="green" icon={ArrowUpCircle} />
        <StatCard title={t.expense} value={totals.expense} tone="red" icon={ArrowDownCircle} />
        <StatCard title={t.balance} value={totals.balance} tone="blue" icon={Wallet} />
      </div>

      <section className="card mt-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold">Resumo do mes</h2>
          <span className="text-xs text-slate-500">Receitas vs Despesas</span>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getBarData(monthTransactions)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="Receitas" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Despesas" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card mt-4">
        <h2 className="mb-3 text-sm font-bold">Top categorias</h2>
        <div className="grid grid-cols-[120px_1fr] items-center gap-3">
          <div className="h-28">
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
      </section>

      <section className="mt-4">
        <h2 className="mb-3 text-sm font-bold">{t.recentTransactions}</h2>
        <div className="space-y-2">
          {transactions.slice(0, 4).map((transaction) => <TransactionItem key={transaction.id} transaction={transaction} />)}
        </div>
      </section>
    </>
  );
}
