import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, FilePieChart, Home, List, MoreHorizontal, Plus, Target, WalletCards } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext.jsx';

const navItems = [
  { to: '/', labelKey: 'dashboard', icon: Home },
  { to: '/transactions', labelKey: 'transactions', icon: List },
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
        <aside className="hidden border-r border-outline bg-surface-secondary/60 p-4 md:flex md:flex-col">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Casa Clara</p>
            <h1 className="mt-2 text-xl font-bold tracking-[-0.02em] text-content">Finanças em harmonia</h1>
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

        <section className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-36 pt-4 md:px-6 md:pb-8 md:pt-6">
          <Outlet />
        </section>

        <button
          className="fixed bottom-[calc(8.75rem+10px+env(safe-area-inset-bottom))] left-1/2 z-30 grid h-16 w-16 -translate-x-1/2 place-items-center rounded-full bg-brand-600 text-white shadow-[0_10px_28px_rgba(57,113,91,0.32)] transition duration-fast hover:bg-brand-700 active:scale-95 md:hidden"
          onClick={() => navigate('/transactions/new')}
          aria-label={t.newTransaction}
          title={t.newTransaction}
        >
          <Plus className="h-7 w-7" />
        </button>

        <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-full border-t border-outline bg-surface/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgba(32,37,32,0.05)] backdrop-blur sm:max-w-md md:hidden">
          <div className="flex min-w-0 items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `nav-icon ${isActive ? 'nav-icon-active' : ''}`}>
                  <Icon className="h-7 w-7" />
                  <span className="truncate">{t[item.labelKey]}</span>
                </NavLink>
              );
            })}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button onClick={() => navigate('/goals')} className="inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-xl bg-surface-secondary px-3 text-sm font-semibold text-muted transition active:scale-[0.98] active:text-brand-700">
              <Target className="h-6 w-6" /> {t.goals}
            </button>
            <button onClick={() => navigate('/accounts')} className="inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-xl bg-surface-secondary px-3 text-sm font-semibold text-muted transition active:scale-[0.98] active:text-brand-700">
              <WalletCards className="h-6 w-6" /> {t.accounts}
            </button>
          </div>
        </nav>
      </div>
    </main>
  );
}
