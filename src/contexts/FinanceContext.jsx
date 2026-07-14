import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import localforage from 'localforage';
import { dictionaries } from '../data/i18n';
import { initialState } from '../data/seed';
import { uid } from '../utils/formatters';

const STORAGE_KEY = 'casa-clara-data';
const FinanceContext = createContext(null);

localforage.config({
  name: 'CasaClara',
  storeName: 'finance'
});

export function FinanceProvider({ children }) {
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localforage.getItem(STORAGE_KEY).then((saved) => {
      if (saved) setState({ ...initialState, ...saved });
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      localforage.setItem(STORAGE_KEY, state);
      document.documentElement.classList.toggle('dark', state.profile.theme === 'dark');
    }
  }, [loading, state]);

  const updateState = (patch) => setState((current) => ({ ...current, ...patch }));
  const updateProfile = (patch) => setState((current) => ({ ...current, profile: { ...current.profile, ...patch } }));

  const addTransaction = (transaction) => {
    setState((current) => ({
      ...current,
      transactions: [{ ...transaction, id: uid('t'), value: Number(transaction.value) }, ...current.transactions]
    }));
  };

  const updateTransaction = (id, transaction) => {
    setState((current) => ({
      ...current,
      transactions: current.transactions.map((item) => (item.id === id ? { ...transaction, id, value: Number(transaction.value) } : item))
    }));
  };

  const deleteTransaction = (id) => {
    setState((current) => ({
      ...current,
      transactions: current.transactions.filter((transaction) => transaction.id !== id)
    }));
  };

  const addBudget = (budget) => {
    setState((current) => ({
      ...current,
      budgets: [...current.budgets, { ...budget, id: uid('b'), limit: Number(budget.limit) }]
    }));
  };

  const addGoal = (goal) => {
    setState((current) => ({
      ...current,
      goals: [...current.goals, { ...goal, id: uid('g'), target: Number(goal.target), current: Number(goal.current) }]
    }));
  };

  const addAccount = (account) => {
    setState((current) => ({
      ...current,
      accounts: [...current.accounts, { ...account, id: uid('acc'), balance: Number(account.balance) }]
    }));
  };

  const restoreData = (data) => setState({ ...initialState, ...data });
  const resetData = () => setState(initialState);

  const value = useMemo(() => {
    const language = state.profile.language || 'pt';
    return {
      ...state,
      loading,
      t: dictionaries[language] || dictionaries.pt,
      updateState,
      updateProfile,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addBudget,
      addGoal,
      addAccount,
      restoreData,
      resetData
    };
  }, [loading, state]);

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used inside FinanceProvider');
  return context;
}
