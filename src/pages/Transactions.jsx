import { Link } from 'react-router-dom';
import { Plus, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import TransactionItem from '../components/TransactionItem.jsx';
import { categories } from '../data/seed.js';
import { useFinance } from '../contexts/FinanceContext.jsx';

export default function Transactions() {
  const { transactions, t } = useFinance();
  const [filters, setFilters] = useState({ type: 'all', category: 'all', period: 'all' });
  const allCategories = [...categories.income, ...categories.expense];

  const filtered = useMemo(() => {
    return transactions.filter((transaction) => {
      const typeMatch = filters.type === 'all' || transaction.type === filters.type;
      const categoryMatch = filters.category === 'all' || transaction.category === filters.category;
      const periodMatch = filters.period === 'all' || transaction.date.startsWith(filters.period);
      return typeMatch && categoryMatch && periodMatch;
    });
  }, [filters, transactions]);

  return (
    <>
      <PageHeader
        title={t.transactions}
        subtitle={`${filtered.length} registros encontrados`}
        action={<Link className="button-primary h-10 px-3" to="/transactions/new"><Plus className="h-4 w-4" /></Link>}
      />

      <section className="card mb-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold"><SlidersHorizontal className="h-4 w-4" /> Filtros</div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <select className="input" value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })}>
            <option value="all">Todos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>
          <select className="input" value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })}>
            <option value="all">Todas categorias</option>
            {allCategories.map((category) => <option key={category}>{category}</option>)}
          </select>
          <input className="input" type="month" value={filters.period === 'all' ? '' : filters.period} onChange={(event) => setFilters({ ...filters, period: event.target.value || 'all' })} />
        </div>
      </section>

      <div className="space-y-2">
        {filtered.map((transaction) => <TransactionItem editable key={transaction.id} transaction={transaction} />)}
      </div>
    </>
  );
}
