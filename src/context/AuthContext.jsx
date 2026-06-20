import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const restore = useCallback(async () => {
    setLoading(true);
    try {
      // Try to restore token from localStorage, but validate with backend
      const stored = localStorage.getItem('token');
      if (stored) {
        const me = await authService.verifyToken(stored);
        if (me && me.user) {
          setUser(me.user);
          setToken(stored);
          return;
        }
      }
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    } catch (err) {
      console.error('Auth restore failed', err);
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { restore(); }, [restore]);

  const login = async (serviceID, password) => {
    setLoading(true);
    try {
      const res = await authService.login(serviceID, password);
      if (res && res.token && res.user) {
        setUser(res.user);
        setToken(res.token);
        // persist token but always validate on restore/refresh
        localStorage.setItem('token', res.token);
        return { ok: true };
      }
      return { ok: false, error: res && res.error };
    } catch (err) {
      console.error('login error', err);
      return { ok: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  // Auto-logout when token expires server-side: verify periodically
  useEffect(() => {
    if (!token) return;
    let mounted = true;
    const t = setInterval(async () => {
      try {
        const me = await authService.verifyToken(token);
        if (!me || !me.user) {
          if (mounted) logout();
        }
      } catch (e) { if (mounted) logout(); }
    }, 5 * 60 * 1000); // every 5 minutes

    return () => { mounted = false; clearInterval(t); };
  }, [token, logout]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, restore }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
