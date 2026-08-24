import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function CollapsibleSection({ title, subtitle, icon: Icon, defaultOpen = true, storageKey: _storageKey, children, action, className = '' }) {
  const [open, setOpen] = useState(defaultOpen);
  const ToggleIcon = open ? ChevronUp : ChevronDown;

  return (
    <section className={`card ${className}`}>
      <div className={`flex items-start justify-between gap-3 ${open ? 'mb-3' : ''}`}>
        <button
          type="button"
          className="flex min-h-11 min-w-0 flex-1 items-start gap-2 rounded-xl text-left transition hover:bg-surface-secondary active:scale-[0.99]"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
        >
          {Icon ? <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-100"><Icon className="h-4 w-4" /></span> : null}
          <span className="min-w-0">
            <span className="block text-sm font-bold text-content">{title}</span>
            {subtitle ? <span className="mt-1 block text-xs text-muted">{subtitle}</span> : null}
          </span>
        </button>

        <div className="flex shrink-0 items-start gap-2">
          {action}
          <button
            type="button"
            className="icon-button border border-outline"
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
