import { formatCurrency } from '../utils/formatters';
import { useFinance } from '../contexts/FinanceContext.jsx';

export default function StatCard({ title, value, tone = 'blue', icon: Icon }) {
  const { profile } = useFinance();
  const tones = {
    green: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300',
    red: 'text-red-700 bg-red-50 dark:bg-red-950 dark:text-red-300',
    blue: 'text-brand-700 bg-brand-50 dark:bg-brand-950 dark:text-brand-200'
  };

  return (
    <article className="card flex items-center gap-3">
      {Icon ? (
        <span className={`grid h-10 w-10 place-items-center rounded-lg ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
      ) : null}
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{title}</p>
        <strong className={`block truncate text-base ${tones[tone].split(' ')[0]}`}>{formatCurrency(value, profile.currency, profile.language)}</strong>
      </div>
    </article>
  );
}
