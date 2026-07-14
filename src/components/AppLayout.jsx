import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, Home, List, MoreHorizontal, Plus, Target, WalletCards } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext.jsx';

const navItems = [
  { to: '/', labelKey: 'dashboard', icon: Home },
  { to: '/transactions', labelKey: 'transactions', icon: List },
  { to: '/transactions/new', labelKey: 'add', icon: Plus, action: true },
  { to: '/budgets', labelKey: 'budgets', icon: BarChart3 },
  { to: '/settings', labelKey: 'settings', icon: MoreHorizontal }
];

export default function AppLayout() {
  const { t } = useFinance();
  const navigate = useNavigate();

  return (
    <main className="screen">
      <div className="app-shell">
        <section className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
          <Outlet />
        </section>

        <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md border-t border-slate-200 bg-white/95 px-3 py-2 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 md:bottom-6 md:rounded-b-[2rem]">
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              if (item.action) {
                return (
                  <button
                    className="grid h-12 w-12 place-items-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/30"
                    key={item.to}
                    onClick={() => navigate(item.to)}
                    aria-label={t.newTransaction}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                );
              }

              return (
                <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `nav-icon ${isActive ? 'nav-icon-active' : ''}`}>
                  <Icon className="h-5 w-5" />
                  <span className="truncate">{t[item.labelKey]}</span>
                </NavLink>
              );
            })}
          </div>
          <div className="mt-1 hidden justify-around text-[10px] text-slate-400 sm:flex">
            <button onClick={() => navigate('/goals')} className="inline-flex items-center gap-1">
              <Target className="h-3 w-3" /> {t.goals}
            </button>
            <button onClick={() => navigate('/accounts')} className="inline-flex items-center gap-1">
              <WalletCards className="h-3 w-3" /> {t.accounts}
            </button>
          </div>
        </nav>
      </div>
    </main>
  );
}
