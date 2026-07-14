import { useRef } from 'react';
import { DatabaseBackup, Globe2, Info, Moon, PiggyBank, RotateCcw, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { languages } from '../data/i18n.js';
import { useFinance } from '../contexts/FinanceContext.jsx';
import { appConfig } from '../config/app.js';

export default function Settings() {
  const { profile, updateProfile, restoreData, resetData, t, ...data } = useFinance();
  const fileInput = useRef(null);

  const backup = () => {
    const blob = new Blob([JSON.stringify({ ...data, profile }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'casa-clara-backup.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const restore = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => restoreData(JSON.parse(reader.result));
    reader.readAsText(file);
  };

  return (
    <>
      <PageHeader title="Configuracoes" subtitle="Perfil, tema, idioma e dados" />

      <section className="card space-y-4">
        <label>
          <span className="label">Perfil do casal</span>
          <input className="input" value={profile.coupleName} onChange={(event) => updateProfile({ coupleName: event.target.value })} />
        </label>
        <label>
          <span className="label">Moeda</span>
          <select className="input" value={profile.currency} onChange={(event) => updateProfile({ currency: event.target.value })}>
            <option value="BRL">Real (R$)</option>
            <option value="USD">Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
          </select>
        </label>
        <label>
          <span className="label">Idioma</span>
          <select className="input" value={profile.language} onChange={(event) => updateProfile({ language: event.target.value })}>
            {languages.map((language) => <option key={language.code} value={language.code}>{language.name}</option>)}
          </select>
        </label>
      </section>

      <section className="mt-4 space-y-2">
        <div className="grid grid-cols-3 gap-2">
          <Link className="button-secondary px-2 text-xs" to="/goals">Metas</Link>
          <Link className="button-secondary px-2 text-xs" to="/accounts">Contas</Link>
          <Link className="button-secondary px-2 text-xs" to="/reports">Relatorios</Link>
        </div>
        <button className="card flex w-full items-center justify-between text-left" onClick={() => updateProfile({ theme: profile.theme === 'dark' ? 'light' : 'dark' })}>
          <span className="flex items-center gap-3 text-sm font-semibold"><Moon className="h-5 w-5 text-brand-600" /> Tema</span>
          <span className="text-xs text-slate-500">{profile.theme === 'dark' ? 'Escuro' : 'Claro'}</span>
        </button>
        <button className="card flex w-full items-center gap-3 text-left text-sm font-semibold" onClick={backup}><DatabaseBackup className="h-5 w-5 text-brand-600" /> Backup de dados</button>
        <button className="card flex w-full items-center gap-3 text-left text-sm font-semibold" onClick={() => fileInput.current?.click()}><Upload className="h-5 w-5 text-brand-600" /> Restaurar dados</button>
        <input ref={fileInput} className="hidden" type="file" accept="application/json" onChange={restore} />
        <button className="card flex w-full items-center gap-3 text-left text-sm font-semibold text-red-600" onClick={resetData}><RotateCcw className="h-5 w-5" /> Reiniciar app</button>
      </section>

      <section className="card mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white"><Info className="h-4 w-4" /> Sobre o app</h2>
        <p>Desenvolvido por {appConfig.author}.</p>
        <p>Os dados inseridos no Casa Clara podem ser usados para os mais diversos fins.</p>
        <p>Este app e gratuito, mas podemos tornar alguns recursos pagos no futuro.</p>
        <p>Ao usar, voce concorda com nossos Termos de Uso e Politica de Privacidade.</p>
        <p className="flex items-center gap-2 text-xs"><PiggyBank className="h-4 w-4" /> Dados locais com IndexedDB.</p>
        <p className="flex items-center gap-2 text-xs"><Globe2 className="h-4 w-4" /> Portugues, English, Espanol e Italiano.</p>
      </section>
    </>
  );
}
