import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function CollapsibleSection({ title, subtitle, icon: Icon, defaultOpen = true, storageKey, children, action, className = '' }) {
  const [open, setOpen] = useState(() => {
    if (!storageKey) return defaultOpen;

    try {
      const saved = localStorage.getItem(storageKey);
      return saved === null ? defaultOpen : saved === 'true';
    } catch {
      return defaultOpen;
    }
  });
  const ToggleIcon = open ? ChevronUp : ChevronDown;

  useEffect(() => {
    if (!storageKey) return;

    try {
      localStorage.setItem(storageKey, String(open));
    } catch {
      // Keep the UI working even when browser storage is unavailable.
    }
  }, [open, storageKey]);

  return (
    <section className={`card ${className}`}>
      <div className={`flex items-start justify-between gap-3 ${open ? 'mb-3' : ''}`}>
        <button
          type="button"
          className="flex min-h-11 min-w-0 flex-1 items-start gap-2 rounded-lg text-left active:bg-slate-50 dark:active:bg-slate-800"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
        >
          {Icon ? <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" /> : null}
          <span className="min-w-0">
            <span className="block text-sm font-bold text-slate-950 dark:text-white">{title}</span>
            {subtitle ? <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{subtitle}</span> : null}
          </span>
        </button>

        <div className="flex shrink-0 items-start gap-2">
          {action}
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-lg border border-slate-200 text-slate-500 active:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:active:bg-slate-800"
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? `Fechar ${title}` : `Abrir ${title}`}
            aria-expanded={open}
          >
            <ToggleIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {open ? children : null}
    </section>
  );
}
