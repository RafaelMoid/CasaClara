export function getMonthlyTransactions(transactions, month = new Date().getMonth(), year = new Date().getFullYear()) {
  return transactions.filter((transaction) => {
    const date = new Date(transaction.date);
    return date.getMonth() === month && date.getFullYear() === year;
  });
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
  const days = ['01', '08', '15', '22', '29'];
  return days.map((day) => {
    const dayTransactions = transactions.filter((transaction) => transaction.date.slice(8, 10) <= day);
    const totals = getTotals(dayTransactions);
    return {
      name: `${day}/07`,
      Receitas: totals.income,
      Despesas: totals.expense
    };
  });
}
