import { Check, ChevronDown, X } from 'lucide-react';

export default function ModalSelect({ label, value, options, onChange }) {
  const safeOptions = Array.isArray(options) ? options : [];
  const selected = safeOptions.find((option) => option.value === value) || safeOptions[0] || { value: '', label: 'Nenhuma opcao' };
  const dialogId = `dialog-${label.toLowerCase().replaceAll(' ', '-')}`;

  return (
    <div>
      <span className="label">{label}</span>
      <button
        type="button"
        className="input flex items-center justify-between text-left font-semibold active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={!safeOptions.length}
        onClick={() => document.getElementById(dialogId)?.showModal()}
      >
        <span className="truncate">{selected.label}</span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      <dialog id={dialogId} className="fixed inset-x-0 bottom-0 top-auto m-0 w-full max-w-none rounded-t-3xl border border-outline bg-surface p-0 text-content shadow-2xl backdrop:bg-slate-950/45 sm:inset-auto sm:m-auto sm:max-w-sm sm:rounded-2xl">
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-outline sm:hidden" />
        <div className="flex items-center justify-between border-b border-outline px-4 py-3">
          <h2 className="text-sm font-bold">{label}</h2>
          <button
            type="button"
            className="icon-button"
            onClick={() => document.getElementById(dialogId)?.close()}
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60dvh] overflow-y-auto p-2">
          {safeOptions.map((option) => {
            const active = option.value === value;
            return (
              <button
                type="button"
                key={option.value}
                className={`flex min-h-12 w-full items-center justify-between rounded-xl px-3 text-left text-sm font-semibold transition active:scale-[0.99] ${active ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-100' : 'text-content hover:bg-surface-secondary'}`}
                onClick={() => {
                  onChange(option.value);
                  document.getElementById(dialogId)?.close();
                }}
              >
                <span>{option.label}</span>
                {active ? <Check className="h-4 w-4" /> : null}
              </button>
            );
          })}
        </div>
      </dialog>
    </div>
  );
}
