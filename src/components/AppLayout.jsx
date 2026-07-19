import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, FilePieChart, Home, List, MoreHorizontal, Plus, Target, WalletCards } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext.jsx';

const navItems = [
  { to: '/', labelKey: 'dashboard', icon: Home },
  { to: '/transactions', labelKey: 'transactions', icon: List },
  { to: '/transactions/new', labelKey: 'add', icon: Plus, action: true },
  { to: '/budgets', labelKey: 'budgets', icon: BarChart3 },
  { to: '/settings', labelKey: 'settings', icon: MoreHorizontal }
];

const desktopItems = [
  { to: '/', labelKey: 'dashboard', icon: Home },
  { to: '/transactions', labelKey: 'transactions', icon: List },
  { to: '/budgets', labelKey: 'budgets', icon: BarChart3 },
  { to: '/goals', labelKey: 'goals', icon: Target },
  { to: '/accounts', labelKey: 'accounts', icon: WalletCards },
  { to: '/reports', labelKey: 'reports', icon: FilePieChart },
  { to: '/settings', labelKey: 'settings', icon: MoreHorizontal }
];

export default function AppLayout() {
  const { t } = useFinance();
  const navigate = useNavigate();

  return (
    <main className="screen">
      <div className="app-shell">
        <aside className="hidden border-r border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40 md:flex md:flex-col">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Casa Clara</p>
            <h1 className="mt-2 text-xl font-black text-slate-950 dark:text-white">Controle financeiro</h1>
          </div>

          <button className="button-primary mb-5 w-full" onClick={() => navigate('/transactions/new')}>
            <Plus className="h-5 w-5" />
            {t.newTransaction}
          </button>

          <nav className="space-y-1">
            {desktopItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}>
                  <Icon className="h-6 w-6 shrink-0" />
                  <span>{t[item.labelKey]}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <section className="flex-1 overflow-y-auto px-4 pb-36 pt-4 md:px-6 md:pb-8 md:pt-6">
          <Outlet />
        </section>

        <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md border-t border-slate-200 bg-white/95 px-3 py-2 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 md:hidden">
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              if (item.action) {
                return (
                  <button
                    className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/30 active:scale-[0.98] active:bg-brand-700"
                    key={item.to}
                    onClick={() => navigate(item.to)}
                    aria-label={t.newTransaction}
                  >
                    <Icon className="h-7 w-7" />
                  </button>
                );
              }

              return (
                <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `nav-icon ${isActive ? 'nav-icon-active' : ''}`}>
                  <Icon className="h-7 w-7" />
                  <span className="truncate">{t[item.labelKey]}</span>
                </NavLink>
              );
            })}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button onClick={() => navigate('/goals')} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-slate-50 px-3 text-sm font-semibold text-slate-600 active:bg-brand-50 active:text-brand-700 dark:bg-slate-800 dark:text-slate-200">
              <Target className="h-6 w-6" /> {t.goals}
            </button>
            <button onClick={() => navigate('/accounts')} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-slate-50 px-3 text-sm font-semibold text-slate-600 active:bg-brand-50 active:text-brand-700 dark:bg-slate-800 dark:text-slate-200">
              <WalletCards className="h-6 w-6" /> {t.accounts}
            </button>
          </div>
        </nav>
      </div>
    </main>
  );
}
