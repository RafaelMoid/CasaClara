import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(api.enabled());
  const [apiAvailable, setApiAvailable] = useState(api.enabled());
  const [error, setError] = useState('');

  useEffect(() => {
    if (!api.enabled()) return;

    api
      .me()
      .then(async (data) => {
        setApiAvailable(true);
        setUser(data.user);
        const familyData = await api.families();
        setFamilies(familyData.families);
      })
      .catch(() => {
        setUser(null);
        setFamilies([]);
        setApiAvailable(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (payload) => {
    setError('');
    const data = await api.login(payload);
    setApiAvailable(true);
    setUser(data.user);
    const familyData = await api.families();
    setFamilies(familyData.families);
    return data;
  };

  const register = async (payload) => {
    setError('');
    const data = await api.register(payload);
    setApiAvailable(true);
    setUser(data.user);
    const familyData = await api.families();
    setFamilies(familyData.families);
    return data;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    setFamilies([]);
  };

  const value = useMemo(
    () => ({
      apiEnabled: api.enabled() && apiAvailable,
      apiConfigured: api.enabled(),
      apiAvailable,
      user,
      families,
      loading,
      error,
      setError,
      login,
      register,
      logout
    }),
    [apiAvailable, error, families, loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
