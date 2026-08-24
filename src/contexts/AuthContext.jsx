import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  createInitialFamily,
  getUserFamilies,
  sendPasswordResetEmail,
  supabase,
  supabaseEnabled,
  updateSupabasePassword
} from '../services/supabase.js';

const AuthContext = createContext(null);
const PASSWORD_RECOVERY_KEY = 'casa-clara-password-recovery';
const PASSWORD_RECOVERY_TTL = 30 * 60 * 1000;

function getPasswordRecoveryState() {
  const recoveryStartedAt = Number(window.localStorage.getItem(PASSWORD_RECOVERY_KEY));
  if (!recoveryStartedAt) return false;

  if (Date.now() - recoveryStartedAt > PASSWORD_RECOVERY_TTL) {
    window.localStorage.removeItem(PASSWORD_RECOVERY_KEY);
    return false;
  }

  return true;
}

async function ensureUserFamilies(sessionUser) {
  if (!sessionUser) return [];

  const families = await getUserFamilies(sessionUser.id);
  if (families.length) return families;

  const pendingFamilyName = sessionUser.user_metadata?.familyName;
  const pendingName = sessionUser.user_metadata?.name || sessionUser.email?.split('@')[0] || 'Usuario principal';

  if (!pendingFamilyName) return [];

  await createInitialFamily({
    user: sessionUser,
    name: pendingName,
    familyName: pendingFamilyName
  });

  return getUserFamilies(sessionUser.id);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(supabaseEnabled);
  const [apiAvailable, setApiAvailable] = useState(supabaseEnabled);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [passwordRecovery, setPasswordRecovery] = useState(getPasswordRecoveryState);
  const familySetupPromiseRef = useRef(null);

  const loadFamilies = async (sessionUser) => {
    if (!sessionUser) return [];
    if (familySetupPromiseRef.current) return familySetupPromiseRef.current;

    familySetupPromiseRef.current = ensureUserFamilies(sessionUser).finally(() => {
      familySetupPromiseRef.current = null;
    });

    return familySetupPromiseRef.current;
  };

  useEffect(() => {
    if (!supabaseEnabled) return;

    let mounted = true;

    supabase.auth
      .getSession()
      .then(async ({ data }) => {
        if (!mounted) return;
        if (!data.session) {
          setUser(null);
          setFamilies([]);
          setApiAvailable(true);
          return;
        }

        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
          await supabase.auth.signOut();
          setUser(null);
          setFamilies([]);
          setApiAvailable(true);
          return;
        }

        const sessionUser = userData.user;
        setApiAvailable(true);
        setUser(sessionUser);
        setFamilies(await loadFamilies(sessionUser));
      })
      .catch(() => {
        setUser(null);
        setFamilies([]);
        setApiAvailable(false);
      })
      .finally(() => setLoading(false));

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        window.localStorage.setItem(PASSWORD_RECOVERY_KEY, String(Date.now()));
        setPasswordRecovery(true);
      }

      const sessionUser = session?.user || null;
      setUser(sessionUser);
      setFamilies(await loadFamilies(sessionUser));
      setLoading(false);
    });

    const syncPasswordRecovery = (event) => {
      if (event.key === PASSWORD_RECOVERY_KEY) {
        setPasswordRecovery(getPasswordRecoveryState());
      }
    };
    window.addEventListener('storage', syncPasswordRecovery);

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
      window.removeEventListener('storage', syncPasswordRecovery);
    };
  }, []);

  const login = async (payload) => {
    setError('');
    setMessage('');
    const { data, error: signInError } = await supabase.auth.signInWithPassword(payload);
    if (signInError) throw signInError;
    setApiAvailable(true);
    setUser(data.user);
    setFamilies(await loadFamilies(data.user));
    return { user: data.user };
  };

  const register = async (payload) => {
    setError('');
    setMessage('');
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          name: payload.name,
          familyName: payload.familyName
        }
      }
    });

    if (signUpError) throw signUpError;

    if (!data.session) {
      setMessage('Cadastro criado. Confirme seu e-mail para entrar no Casa Clara.');
      return { needsEmailConfirmation: true };
    }

    await createInitialFamily({
      user: data.user,
      name: payload.name,
      familyName: payload.familyName
    });

    setApiAvailable(true);
    setUser(data.user);
    setFamilies(await loadFamilies(data.user));
    return { user: data.user };
  };

  const requestPasswordReset = async (email) => {
    setError('');
    setMessage('');
    await sendPasswordResetEmail(email);
    setMessage('Enviamos um link de redefinicao de senha para o seu e-mail.');
  };

  const updatePassword = async (password) => {
    setError('');
    setMessage('');
    await updateSupabasePassword(password);
    await supabase.auth.signOut();
    window.localStorage.removeItem(PASSWORD_RECOVERY_KEY);
    setUser(null);
    setFamilies([]);
    setPasswordRecovery(false);
    setMessage('Senha atualizada com sucesso. Entre novamente com a nova senha.');
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.localStorage.removeItem(PASSWORD_RECOVERY_KEY);
    setUser(null);
    setFamilies([]);
    setPasswordRecovery(false);
  };

  const value = useMemo(
    () => ({
      apiEnabled: supabaseEnabled && apiAvailable,
      apiConfigured: supabaseEnabled,
      apiAvailable,
      user,
      families,
      loading,
      error,
      message,
      passwordRecovery,
      setError,
      setMessage,
      login,
      register,
      requestPasswordReset,
      updatePassword,
      logout
    }),
    [apiAvailable, error, families, loading, message, passwordRecovery, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
