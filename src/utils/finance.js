export function getMonthKey(date = new Date()) {
  if (typeof date === 'string') return date.slice(0, 7);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function getMonthlyTransactions(transactions, monthKey = getMonthKey()) {
  return transactions.filter((transaction) => transaction.date?.startsWith(monthKey));
}

export function getTotals(transactions) {
  return transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') acc.income += Number(transaction.value);
      if (transaction.type === 'expense') acc.expense += Number(transaction.value);
      acc.balance = acc.income - acc.expense;
      return acc;
    },
    { income: 0, expense: 0, balance: 0 }
  );
}

export function getCategoryTotals(transactions, type = 'expense') {
  const totals = transactions
    .filter((transaction) => transaction.type === type)
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + Number(transaction.value);
      return acc;
    }, {});

  return Object.entries(totals).map(([name, value]) => ({ name, value }));
}

export function getBarData(transactions) {
  const grouped = transactions.reduce((acc, transaction) => {
    const date = transaction.date;
    if (!acc[date]) {
      acc[date] = {
        name: date.slice(8, 10) + '/' + date.slice(5, 7),
        date,
        Receitas: 0,
        Despesas: 0
      };
    }

    if (transaction.type === 'income') acc[date].Receitas += Number(transaction.value);
    if (transaction.type === 'expense') acc[date].Despesas += Number(transaction.value);
    return acc;
  }, {});

  return Object.values(grouped)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(({ date: _date, ...item }) => item);
}
