export function formatCurrency(value, currency = 'BRL', language = 'pt') {
  const locales = {
    pt: 'pt-BR',
    en: 'en-US',
    es: 'es-ES',
    it: 'it-IT'
  };

  return new Intl.NumberFormat(locales[language] || 'pt-BR', {
    style: 'currency',
    currency,
  }).format(value || 0);
}

export function formatDate(date, language = 'pt') {
  const locales = {
    pt: 'pt-BR',
    en: 'en-US',
    es: 'es-ES',
    it: 'it-IT'
  };

  return new Intl.DateTimeFormat(locales[language] || 'pt-BR', {
    day: '2-digit',
    month: 'short'
  }).format(new Date(date));
}

export function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function downloadCsv(filename, rows) {
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
