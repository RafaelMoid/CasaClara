import { useState } from 'react';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Auth() {
  const { user, login, register, requestPasswordReset, updatePassword, passwordRecovery, error, message, setError, setMessage } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', familyName: '', newPassword: '', confirmNewPassword: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  if (user && !passwordRecovery) return <Navigate to="/" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      if (passwordRecovery) {
        if (form.newPassword !== form.confirmNewPassword) {
          throw new Error('As senhas não são iguais. Verifique e tente novamente.');
        }
        await updatePassword(form.newPassword);
      } else if (mode === 'login') {
        await login({ email: form.email, password: form.password });
      } else if (mode === 'reset') {
        await requestPasswordReset(form.email);
      } else {
        const result = await register(form);
        if (result?.needsEmailConfirmation) {
          setMode('login');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="screen grid min-w-0 grid-cols-[minmax(0,1fr)] place-items-center px-4">
      <form className="min-w-0 w-full max-w-sm rounded-3xl border border-outline bg-surface p-6 shadow-soft" onSubmit={submit}>
        <div className="mb-5 text-center">
          <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-100"><ShieldCheck className="h-7 w-7" /></span>
          <h1 className="text-2xl font-bold tracking-[-0.03em]">Casa Clara</h1>
          <p className="mt-1.5 text-sm text-muted">
            {passwordRecovery ? 'Defina sua nova senha' : mode === 'login' ? 'Entre com sua conta' : mode === 'reset' ? 'Recupere sua senha' : 'Crie sua conta segura'}
          </p>
        </div>

        {!passwordRecovery ? <div className="mb-5 grid grid-cols-2 rounded-xl bg-surface-secondary p-1">
          <button type="button" className={`h-10 rounded-lg text-sm font-bold transition ${mode === 'login' ? 'bg-surface text-brand-700 shadow-sm dark:text-brand-100' : 'text-muted'}`} onClick={() => setMode('login')}>
            Login
          </button>
          <button type="button" className={`h-10 rounded-lg text-sm font-bold transition ${mode === 'register' ? 'bg-surface text-brand-700 shadow-sm dark:text-brand-100' : 'text-muted'}`} onClick={() => setMode('register')}>
            Cadastro
          </button>
        </div> : null}

        {passwordRecovery ? (
          <>
            <label className="label">Nova senha</label>
            <div className="relative mb-3">
              <input className="input pr-12" type={showNewPassword ? 'text' : 'password'} minLength={8} value={form.newPassword} onChange={(event) => setForm({ ...form, newPassword: event.target.value })} required />
              <button type="button" className="absolute inset-y-0 right-0 grid w-12 place-items-center text-slate-500" onClick={() => setShowNewPassword((visible) => !visible)} aria-label={showNewPassword ? 'Ocultar nova senha' : 'Mostrar nova senha'}>
                {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <label className="label">Repita a nova senha</label>
            <div className="relative mb-4">
              <input className="input pr-12" type={showConfirmNewPassword ? 'text' : 'password'} minLength={8} value={form.confirmNewPassword} onChange={(event) => setForm({ ...form, confirmNewPassword: event.target.value })} required />
              <button type="button" className="absolute inset-y-0 right-0 grid w-12 place-items-center text-slate-500" onClick={() => setShowConfirmNewPassword((visible) => !visible)} aria-label={showConfirmNewPassword ? 'Ocultar confirmação da senha' : 'Mostrar confirmação da senha'}>
                {showConfirmNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </>
        ) : null}

        {!passwordRecovery && mode === 'register' ? (
          <>
            <label className="label">Nome</label>
            <input className="input mb-3" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            <label className="label">Nome da familia</label>
            <input className="input mb-3" value={form.familyName} onChange={(event) => setForm({ ...form, familyName: event.target.value })} required />
          </>
        ) : null}

        {!passwordRecovery ? (
          <>
            <label className="label">E-mail</label>
            <input className="input mb-3" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </>
        ) : null}

        {!passwordRecovery && mode !== 'reset' ? (
          <>
            <label className="label">Senha</label>
            <input className="input mb-4" type="password" minLength={8} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          </>
        ) : null}

        {message ? <p className="mb-3 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{message}</p> : null}
        {error ? <p className="mb-3 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">{error}</p> : null}

        <button className="button-primary w-full" disabled={submitting}>
          {submitting ? 'Aguarde...' : passwordRecovery ? 'Atualizar senha' : mode === 'login' ? 'Entrar' : mode === 'reset' ? 'Enviar link' : 'Criar conta'}
        </button>

        {!passwordRecovery && mode === 'login' ? (
          <button type="button" className="mt-4 w-full text-center text-sm font-bold text-brand-700" onClick={() => setMode('reset')}>
            Esqueci minha senha
          </button>
        ) : null}

        {!passwordRecovery && mode === 'reset' ? (
          <button type="button" className="mt-4 w-full text-center text-sm font-bold text-brand-700" onClick={() => setMode('login')}>
            Voltar para login
          </button>
        ) : null}
      </form>
    </main>
  );
}
