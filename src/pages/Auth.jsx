import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Auth() {
  const { user, login, register, error, setError } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', familyName: '' });
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="screen grid place-items-center px-4">
      <form className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900" onSubmit={submit}>
        <div className="mb-5 text-center">
          <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-brand-600" />
          <h1 className="text-2xl font-black">Casa Clara</h1>
          <p className="mt-1 text-sm text-slate-500">{mode === 'login' ? 'Entre com sua conta' : 'Crie sua conta segura'}</p>
        </div>

        <div className="mb-4 grid grid-cols-2 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          <button type="button" className={`h-10 rounded-md text-sm font-bold ${mode === 'login' ? 'bg-white text-brand-700 shadow-sm dark:bg-slate-950' : 'text-slate-500'}`} onClick={() => setMode('login')}>
            Login
          </button>
          <button type="button" className={`h-10 rounded-md text-sm font-bold ${mode === 'register' ? 'bg-white text-brand-700 shadow-sm dark:bg-slate-950' : 'text-slate-500'}`} onClick={() => setMode('register')}>
            Cadastro
          </button>
        </div>

        {mode === 'register' ? (
          <>
            <label className="label">Nome</label>
            <input className="input mb-3" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            <label className="label">Nome da familia</label>
            <input className="input mb-3" value={form.familyName} onChange={(event) => setForm({ ...form, familyName: event.target.value })} required />
          </>
        ) : null}

        <label className="label">E-mail</label>
        <input className="input mb-3" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />

        <label className="label">Senha</label>
        <input className="input mb-4" type="password" minLength={8} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />

        {error ? <p className="mb-3 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">{error}</p> : null}

        <button className="button-primary w-full" disabled={submitting}>
          {submitting ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
        </button>

        <p className="mt-4 text-center text-xs text-slate-500">Sessao protegida por cookie HttpOnly. Nao salvamos token no navegador.</p>
      </form>
    </main>
  );
}
