import { useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Download } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import { useFinance } from '../contexts/FinanceContext.jsx';
import { downloadCsv } from '../utils/formatters.js';
import { getCategoryTotals, getTotals } from '../utils/finance.js';

const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#64748b'];

export default function Reports() {
  const { transactions, t } = useFinance();
  const [period, setPeriod] = useState('2026-07');
  const filtered = useMemo(() => transactions.filter((transaction) => transaction.date.startsWith(period)), [period, transactions]);
  const totals = getTotals(filtered);
  const pieData = getCategoryTotals(filtered, 'expense');

  const exportCsv = () => {
    downloadCsv('casa-clara-transacoes.csv', [
      ['Tipo', 'Categoria', 'Descricao', 'Valor', 'Data', 'Conta', 'Pagamento', 'Recorrente'],
      ...filtered.map((item) => [item.type, item.category, item.description, item.value, item.date, item.account, item.paymentMethod, item.recurring ? 'Sim' : 'Nao'])
    ]);
  };

  return (
    <>
      <PageHeader title={t.reports} subtitle="Resumo por periodo" />
      <input className="input mb-4" type="month" value={period} onChange={(event) => setPeriod(event.target.value)} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard title={t.income} value={totals.income} tone="green" />
        <StatCard title={t.expense} value={totals.expense} tone="red" />
        <StatCard title={t.balance} value={totals.balance} tone="blue" />
      </div>

      <section className="card mt-4">
        <h2 className="mb-3 text-sm font-bold">Despesas por categoria</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={54} outerRadius={92}>
                {pieData.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <button className="button-primary mt-4 w-full" onClick={exportCsv}><Download className="h-4 w-4" /> {t.exportCsv}</button>
    </>
  );
}
