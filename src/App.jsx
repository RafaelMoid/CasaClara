import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useFinance } from './contexts/FinanceContext.jsx';
import AppLayout from './components/AppLayout.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Terms from './pages/Terms.jsx';
import CoupleSetup from './pages/CoupleSetup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import TransactionForm from './pages/TransactionForm.jsx';
import Budgets from './pages/Budgets.jsx';
import Goals from './pages/Goals.jsx';
import Accounts from './pages/Accounts.jsx';
import Reports from './pages/Reports.jsx';
import Settings from './pages/Settings.jsx';

function GuardedRoute({ children }) {
  const { setupComplete, termsAccepted } = useFinance();
  const location = useLocation();

  if (!termsAccepted) return <Navigate to="/onboarding" replace state={{ from: location }} />;
  if (!setupComplete) return <Navigate to="/setup" replace state={{ from: location }} />;
  return children;
}

export default function App() {
  const { loading } = useFinance();

  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/setup" element={<CoupleSetup />} />
      <Route
        path="/"
        element={
          <GuardedRoute>
            <AppLayout />
          </GuardedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="transactions/new" element={<TransactionForm />} />
        <Route path="transactions/:id/edit" element={<TransactionForm />} />
        <Route path="budgets" element={<Budgets />} />
        <Route path="goals" element={<Goals />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/onboarding" replace />} />
    </Routes>
  );
}
