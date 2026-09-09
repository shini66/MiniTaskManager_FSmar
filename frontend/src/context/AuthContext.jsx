import { useCallback, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/auth';
import { AUTH_STORAGE_EVENT, getStoredAuth, setStoredAuth } from '../api/client';
import { AuthContext } from './authContextObject';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      const stored = getStoredAuth();
      if (!stored?.token) {
        setIsBooting(false);
        return;
      }

      setToken(stored.token);
      setUser(stored.user ?? null);

      try {
        const me = await authApi.getMe();
        if (!isMounted) return;
        const normalizedUser = { id: me._id, name: me.name, email: me.email };
        setUser(normalizedUser);
        setStoredAuth({ token: stored.token, user: normalizedUser });
      } catch {
        if (!isMounted) return;
        setStoredAuth(null);
        setUser(null);
        setToken(null);
      } finally {
        if (isMounted) setIsBooting(false);
      }
    }

    bootstrap();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    function handleExpired() {
      setUser(null);
      setToken(null);
    }
    window.addEventListener(AUTH_STORAGE_EVENT, handleExpired);
    return () => window.removeEventListener(AUTH_STORAGE_EVENT, handleExpired);
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authApi.login(credentials);
    setStoredAuth({ token: data.token, user: data.user });
    setUser(data.user);
    setToken(data.token);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authApi.register(payload);
    setStoredAuth({ token: data.token, user: data.user });
    setUser(data.user);
    setToken(data.token);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore errors on logout; clear local session regardless.
    } finally {
      setStoredAuth(null);
      setUser(null);
      setToken(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isBooting,
      login,
      register,
      logout,
    }),
    [user, token, isBooting, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
