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
    <article className="card flex min-h-[92px] items-center gap-3 active:border-brand-200 active:bg-brand-50/40 dark:active:border-brand-900 dark:active:bg-slate-800">
      {Icon ? (
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg ${tones[tone]}`}>
          <Icon className="h-6 w-6" />
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{title}</p>
        <strong className={`block whitespace-normal text-[clamp(1.45rem,6vw,2rem)] font-extrabold leading-tight tracking-normal ${tones[tone].split(' ')[0]}`}>
          {formatCurrency(value, profile.currency, profile.language)}
        </strong>
      </div>
    </article>
  );
}
