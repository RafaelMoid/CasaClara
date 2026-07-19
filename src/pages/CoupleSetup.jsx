import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { languages } from '../data/i18n';
import { useFinance } from '../contexts/FinanceContext.jsx';

export default function CoupleSetup() {
  const { profile, completeSetup } = useFinance();
  const [form, setForm] = useState({
    userName: 'Rafael',
    userEmail: 'rafael@casaclara.local',
    familyName: profile.coupleName || 'Minha Familia',
    currency: profile.currency,
    language: profile.language
  });
  const navigate = useNavigate();

  const submit = (event) => {
    event.preventDefault();
    completeSetup(form);
    navigate('/');
  };

  return (
    <main className="screen">
      <form className="app-shell px-5 py-6" onSubmit={submit}>
        <button type="button" className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => navigate('/terms')} aria-label="Voltar">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="mb-6 text-center text-xl font-bold">Criar Familia</h1>
        <label className="label">Seu nome</label>
        <input className="input mb-4" value={form.userName} onChange={(event) => setForm({ ...form, userName: event.target.value })} placeholder="Ex. Rafael" required />
        <label className="label">Seu e-mail</label>
        <input className="input mb-4" type="email" value={form.userEmail} onChange={(event) => setForm({ ...form, userEmail: event.target.value })} placeholder="voce@email.com" required />
        <label className="label">Nome da familia</label>
        <input className="input mb-4" value={form.familyName} onChange={(event) => setForm({ ...form, familyName: event.target.value })} placeholder="Ex. Familia Varela" required />
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
        <button className="button-primary w-full">Criar Familia</button>
        <p className="mt-4 text-center text-xs text-slate-500">Voce podera alterar essas configuracoes depois.</p>
      </form>
    </main>
  );
}
