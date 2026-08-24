import { formatCurrency } from '../utils/formatters';
import { useFinance } from '../contexts/FinanceContext.jsx';

export default function StatCard({ title, value, tone = 'blue', icon: Icon }) {
  const { profile } = useFinance();
  const tones = {
    green: 'text-income bg-emerald-50 dark:bg-emerald-950/70',
    red: 'text-expense bg-red-50 dark:bg-red-950/70',
    blue: 'text-brand-700 bg-brand-50 dark:bg-brand-950 dark:text-brand-100'
  };

  return (
    <article className="card flex min-h-[108px] items-center gap-4 hover:border-brand-100 dark:hover:border-brand-900">
      {Icon ? (
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-6 w-6" />
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">{title}</p>
        <strong className={`mt-1 block whitespace-normal text-[clamp(1.4rem,6vw,1.85rem)] font-bold leading-tight tracking-[-0.03em] ${tones[tone].split(' ')[0]}`}>
          {formatCurrency(value, profile.currency, profile.language)}
        </strong>
      </div>
    </article>
  );
}
