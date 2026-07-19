import { useRef, useState } from 'react';
import { DatabaseBackup, Globe2, Info, MailPlus, Moon, PiggyBank, RotateCcw, Upload, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { languages } from '../data/i18n.js';
import { useFinance } from '../contexts/FinanceContext.jsx';
import { appConfig } from '../config/app.js';

export default function Settings() {
  const {
    profile,
    users,
    invitations,
    activeUser,
    activeFamily,
    activeMembership,
    familyMembers,
    userFamilies,
    updateProfile,
    switchUser,
    switchFamily,
    createFamily,
    inviteMember,
    acceptInvitation,
    restoreData,
    resetData,
    rawState,
    t
  } = useFinance();
  const fileInput = useRef(null);
  const [familyForm, setFamilyForm] = useState({ name: '', currency: activeFamily?.currency || profile.currency, language: activeFamily?.language || profile.language });
  const [inviteForm, setInviteForm] = useState({ name: '', email: '' });
  const pendingInvitations = invitations.filter((invitation) => invitation.status === 'pending');

  const backup = () => {
    const blob = new Blob([JSON.stringify(rawState, null, 2)], { type: 'application/json' });
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
          <span className="label">Usuario ativo</span>
          <select className="input" value={activeUser?.id || ''} onChange={(event) => switchUser(event.target.value)}>
            {users.map((user) => <option key={user.id} value={user.id}>{user.name} · {user.email}</option>)}
          </select>
        </label>
        <label>
          <span className="label">Familia ativa</span>
          <select className="input" value={activeFamily?.id || ''} onChange={(event) => switchFamily(event.target.value)}>
            {userFamilies.map((family) => <option key={family.id} value={family.id}>{family.name}</option>)}
          </select>
        </label>
        <label>
          <span className="label">Nome da familia</span>
          <input className="input" value={activeFamily?.name || ''} onChange={(event) => updateProfile({ coupleName: event.target.value })} />
        </label>
        <label>
          <span className="label">Moeda</span>
          <select className="input" value={activeFamily?.currency || profile.currency} onChange={(event) => updateProfile({ currency: event.target.value })}>
            <option value="BRL">Real (R$)</option>
            <option value="USD">Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
          </select>
        </label>
        <label>
          <span className="label">Idioma</span>
          <select className="input" value={activeFamily?.language || profile.language} onChange={(event) => updateProfile({ language: event.target.value })}>
            {languages.map((language) => <option key={language.code} value={language.code}>{language.name}</option>)}
          </select>
        </label>
      </section>

      <section className="card mt-4 space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-bold"><Users className="h-4 w-4 text-brand-600" /> Familia e membros</h2>
        <div className="space-y-2">
          {familyMembers.map((member) => (
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800" key={member.id}>
              <span className="font-semibold">{member.user.name}</span>
              <span className="text-xs text-slate-500">{member.role === 'owner' ? 'Principal' : 'Membro'}</span>
            </div>
          ))}
        </div>

        {activeMembership?.role === 'owner' ? (
          <form
            className="rounded-lg border border-slate-200 p-3 dark:border-slate-800"
            onSubmit={(event) => {
              event.preventDefault();
              inviteMember(inviteForm);
              setInviteForm({ name: '', email: '' });
            }}
          >
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold"><MailPlus className="h-4 w-4 text-brand-600" /> Convidar membro</h3>
            <input className="input mb-2" placeholder="Nome" value={inviteForm.name} onChange={(event) => setInviteForm({ ...inviteForm, name: event.target.value })} required />
            <input className="input mb-2" type="email" placeholder="email@exemplo.com" value={inviteForm.email} onChange={(event) => setInviteForm({ ...inviteForm, email: event.target.value })} required />
            <button className="button-primary w-full">Gerar convite</button>
          </form>
        ) : (
          <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-800">Apenas o membro principal pode convidar pessoas para esta familia.</p>
        )}

        {pendingInvitations.length ? (
          <div className="space-y-2">
            <h3 className="text-sm font-bold">Convites pendentes</h3>
            {pendingInvitations.map((invitation) => (
              <button className="button-secondary w-full justify-between" key={invitation.id} onClick={() => acceptInvitation(invitation.id)}>
                <span>{invitation.name}</span>
                <span>Aceitar</span>
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <form
        className="card mt-4 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          createFamily(familyForm);
          setFamilyForm({ name: '', currency: activeFamily?.currency || profile.currency, language: activeFamily?.language || profile.language });
        }}
      >
        <h2 className="text-sm font-bold">Criar nova familia</h2>
        <input className="input" placeholder="Nome da familia" value={familyForm.name} onChange={(event) => setFamilyForm({ ...familyForm, name: event.target.value })} required />
        <select className="input" value={familyForm.currency} onChange={(event) => setFamilyForm({ ...familyForm, currency: event.target.value })}>
          <option value="BRL">Real (R$)</option>
          <option value="USD">Dollar ($)</option>
          <option value="EUR">Euro (€)</option>
        </select>
        <select className="input" value={familyForm.language} onChange={(event) => setFamilyForm({ ...familyForm, language: event.target.value })}>
          {languages.map((language) => <option key={language.code} value={language.code}>{language.name}</option>)}
        </select>
        <button className="button-primary w-full">Criar familia</button>
      </form>

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
