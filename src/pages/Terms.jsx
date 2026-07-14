import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext.jsx';

export default function Terms() {
  const [checked, setChecked] = useState(false);
  const { updateState } = useFinance();
  const navigate = useNavigate();

  const continueSetup = () => {
    updateState({ termsAccepted: true });
    navigate('/setup');
  };

  return (
    <main className="screen">
      <div className="app-shell px-5 py-6">
        <button className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => navigate('/onboarding')} aria-label="Voltar">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="mb-4 text-center text-xl font-bold">Termos de Uso</h1>
        <section className="space-y-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
          <p>Bem-vindo ao Casa Clara. Estes Termos de Uso regulam o uso do aplicativo Casa Clara - Controle Financeiro para Casais.</p>
          <p>Ao utilizar o app, voce concorda com estes termos. O Casa Clara e gratuito e podemos, no futuro, oferecer recursos pagos, planos ou assinaturas.</p>
          <p>Os dados inseridos no aplicativo podem ser usados para fins diversos, como organizacao financeira pessoal, planejamento, analises e relatorios.</p>
          <p>Leia nossa Politica de Privacidade para entender como tratamos seus dados. Nesta versao, seus dados ficam salvos localmente no dispositivo.</p>
        </section>
        <label className="mt-6 flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm font-semibold dark:border-slate-800">
          <input className="h-4 w-4 accent-brand-600" type="checkbox" checked={checked} onChange={(event) => setChecked(event.target.checked)} />
          Concordo com os Termos de Uso
        </label>
        <button className="button-primary mt-4 w-full" disabled={!checked} onClick={continueSetup}>Continuar</button>
        <button className="mt-4 w-full text-center text-sm font-semibold text-brand-600">Politica de Privacidade</button>
      </div>
    </main>
  );
}
