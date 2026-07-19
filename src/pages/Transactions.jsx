import { Link } from 'react-router-dom';
import { Plus, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import TransactionItem from '../components/TransactionItem.jsx';
import ModalSelect from '../components/ModalSelect.jsx';
import { categories } from '../data/seed.js';
import { useFinance } from '../contexts/FinanceContext.jsx';

export default function Transactions() {
  const { transactions, t } = useFinance();
  const [filters, setFilters] = useState({ type: 'all', category: 'all', period: 'all' });
  const allCategories = [...categories.income, ...categories.expense];
  const periodOptions = [
    { value: 'all', label: 'Todos os periodos' },
    { value: '2026-07', label: 'Julho 2026' },
    { value: '2026-06', label: 'Junho 2026' },
    { value: '2026-05', label: 'Maio 2026' }
  ];

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
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
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
            options={[
              { value: 'all', label: 'Todas categorias' },
              ...allCategories.map((category) => ({ value: category, label: category }))
            ]}
            onChange={(value) => setFilters({ ...filters, category: value })}
          />
          <ModalSelect
            label="Periodo"
            value={filters.period}
            options={periodOptions}
            onChange={(value) => setFilters({ ...filters, period: value })}
          />
        </div>
      </section>

      <div className="space-y-2">
        {filtered.map((transaction) => <TransactionItem editable key={transaction.id} transaction={transaction} />)}
      </div>
    </>
  );
}
