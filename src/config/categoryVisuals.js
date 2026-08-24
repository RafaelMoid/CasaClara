import {
  BriefcaseBusiness, Bus, Gamepad2, Gift, GraduationCap, HeartPulse,
  House, PiggyBank, ShoppingBasket, Utensils, WalletCards, Wifi
} from 'lucide-react';

const fallback = {
  icon: WalletCards,
  className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200',
  color: '#91a39a'
};

export const categoryVisuals = {
  Salario: { icon: WalletCards, className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300', color: '#78c7a2' },
  Freelance: { icon: BriefcaseBusiness, className: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300', color: '#8bc6df' },
  Investimentos: { icon: PiggyBank, className: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300', color: '#79c7bd' },
  Presente: { icon: Gift, className: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300', color: '#e7a7bd' },
  Moradia: { icon: House, className: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300', color: '#b7a9e7' },
  Alimentacao: { icon: Utensils, className: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300', color: '#edb78f' },
  Transporte: { icon: Bus, className: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300', color: '#e4c16f' },
  Lazer: { icon: Gamepad2, className: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300', color: '#d7a8db' },
  Saude: { icon: HeartPulse, className: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300', color: '#e8a0a0' },
  Educacao: { icon: GraduationCap, className: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300', color: '#a8b5e7' },
  Internet: { icon: Wifi, className: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300', color: '#8ecfd3' },
  Mercado: { icon: ShoppingBasket, className: 'bg-lime-100 text-lime-700 dark:bg-lime-950 dark:text-lime-300', color: '#b6d58a' }
};

export function getCategoryVisual(category) {
  return categoryVisuals[category] || fallback;
}

export const chartPastels = ['#78c7a2', '#edb78f', '#b7a9e7', '#8bc6df', '#e8a0a0', '#e4c16f', '#79c7bd'];
