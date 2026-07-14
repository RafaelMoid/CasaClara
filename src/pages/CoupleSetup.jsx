import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { languages } from '../data/i18n';
import { useFinance } from '../contexts/FinanceContext.jsx';

export default function CoupleSetup() {
  const { profile, updateProfile, updateState } = useFinance();
  const [form, setForm] = useState(profile);
  const navigate = useNavigate();

  const submit = (event) => {
    event.preventDefault();
    updateProfile(form);
    updateState({ setupComplete: true });
    navigate('/');
  };

  return (
    <main className="screen">
      <form className="app-shell px-5 py-6" onSubmit={submit}>
        <button type="button" className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => navigate('/terms')} aria-label="Voltar">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="mb-6 text-center text-xl font-bold">Criar Conta do Casal</h1>
        <label className="label">Nome do casal</label>
        <input className="input mb-4" value={form.coupleName} onChange={(event) => setForm({ ...form, coupleName: event.target.value })} placeholder="Ex. Joao e Maria" required />
        <label className="label">Moeda</label>
        <select className="input mb-4" value={form.currency} onChange={(event) => setForm({ ...form, currency: event.target.value })}>
          <option value="BRL">Real (R$)</option>
          <option value="USD">Dollar ($)</option>
          <option value="EUR">Euro (€)</option>
        </select>
        <label className="label">Idioma</label>
        <select className="input mb-6" value={form.language} onChange={(event) => setForm({ ...form, language: event.target.value })}>
          {languages.map((language) => <option key={language.code} value={language.code}>{language.name}</option>)}
        </select>
        <button className="button-primary w-full">Criar Conta</button>
        <p className="mt-4 text-center text-xs text-slate-500">Voce podera alterar essas configuracoes depois.</p>
      </form>
    </main>
  );
}
