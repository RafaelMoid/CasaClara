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
        className="flex h-11 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-left text-sm font-semibold text-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        disabled={!safeOptions.length}
        onClick={() => document.getElementById(dialogId)?.showModal()}
      >
        <span className="truncate">{selected.label}</span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      <dialog id={dialogId} className="w-[calc(100%-32px)] max-w-sm rounded-xl bg-white p-0 text-slate-950 shadow-2xl backdrop:bg-slate-950/50 dark:bg-slate-900 dark:text-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
          <h2 className="text-sm font-bold">{label}</h2>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg text-slate-500 active:bg-slate-100 dark:active:bg-slate-800"
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
                className={`flex min-h-12 w-full items-center justify-between rounded-lg px-3 text-left text-sm font-semibold active:bg-brand-50 dark:active:bg-slate-800 ${active ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-100' : 'text-slate-700 dark:text-slate-200'}`}
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
