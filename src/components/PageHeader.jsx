export default function PageHeader({ title, subtitle, action }) {
  return (
    <header className="mb-6 flex min-w-0 items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <h1 className="break-words text-2xl font-bold leading-tight tracking-[-0.02em] text-content">{title}</h1>
        {subtitle ? <p className="mt-1.5 break-words text-sm text-muted">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
