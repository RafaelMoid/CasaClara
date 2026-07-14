import { ArrowDownCircle, ArrowUpCircle, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../contexts/FinanceContext.jsx';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function TransactionItem({ transaction, editable = false }) {
  const { profile, deleteTransaction } = useFinance();
  const navigate = useNavigate();
  const isIncome = transaction.type === 'income';

  return (
    <article className="flex items-center gap-3 rounded-lg border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <span className={`grid h-10 w-10 place-items-center rounded-lg ${isIncome ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950' : 'bg-red-50 text-red-600 dark:bg-red-950'}`}>
        {isIncome ? <ArrowUpCircle className="h-5 w-5" /> : <ArrowDownCircle className="h-5 w-5" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{transaction.description}</p>
        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
          {transaction.category} · {formatDate(transaction.date, profile.language)}
        </p>
      </div>
      <div className="text-right">
        <p className={`text-sm font-bold ${isIncome ? 'text-emerald-600' : 'text-red-600'}`}>
          {isIncome ? '+' : '-'} {formatCurrency(transaction.value, profile.currency, profile.language)}
        </p>
        {editable ? (
          <div className="mt-1 flex justify-end gap-1">
            <button className="rounded-md p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => navigate(`/transactions/${transaction.id}/edit`)} aria-label="Editar">
              <Pencil className="h-4 w-4" />
            </button>
            <button className="rounded-md p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950" onClick={() => deleteTransaction(transaction.id)} aria-label="Excluir">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
