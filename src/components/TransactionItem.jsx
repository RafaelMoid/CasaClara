import { Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../contexts/FinanceContext.jsx';
import { formatCurrency, formatDate } from '../utils/formatters';
import { getCategoryVisual } from '../config/categoryVisuals.js';

export default function TransactionItem({ transaction, editable = false }) {
  const { profile, deleteTransaction } = useFinance();
  const navigate = useNavigate();
  const isIncome = transaction.type === 'income';
  const categoryVisual = getCategoryVisual(transaction.category);
  const CategoryIcon = categoryVisual.icon;

  return (
    <article className="group flex min-w-0 items-center gap-3 rounded-2xl border border-outline bg-surface p-3.5 shadow-card transition duration-fast hover:border-brand-100 dark:hover:border-brand-900">
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${categoryVisual.className}`} aria-hidden="true">
        <CategoryIcon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-content">{transaction.description}</p>
        <p className="mt-0.5 truncate text-xs text-muted">
          {transaction.category} · {formatDate(transaction.date, profile.language)}
        </p>
      </div>
      <div className="min-w-0 max-w-[45%] shrink-0 text-right">
        <p className={`break-words text-sm font-bold leading-tight ${isIncome ? 'text-income' : 'text-expense'}`}>
          {isIncome ? '+' : '-'} {formatCurrency(transaction.value, profile.currency, profile.language)}
        </p>
        {editable ? (
          <div className="mt-1 flex justify-end gap-1">
            <button className="rounded-lg p-1.5 text-muted hover:bg-surface-secondary" onClick={() => navigate(`/transactions/${transaction.id}/edit`)} aria-label="Editar">
              <Pencil className="h-4 w-4" />
            </button>
            <button className="rounded-lg p-1.5 text-expense hover:bg-red-50 dark:hover:bg-red-950" onClick={() => deleteTransaction(transaction.id)} aria-label="Excluir">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
