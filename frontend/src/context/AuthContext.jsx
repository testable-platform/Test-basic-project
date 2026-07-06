import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, clearAuth, getStoredUser, getToken, setAuth } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(Boolean(getToken()));

  useEffect(() => {
    async function bootstrap() {
      if (!getToken()) {
        setLoading(false);
        return;
      }

      try {
        const profile = await api.me();
        setUser(profile);
        setAuth(getToken(), profile);
      } catch {
        clearAuth();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    bootstrap();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      async register(payload) {
        const data = await api.register(payload);
        setAuth(data.access_token, data.user);
        setUser(data.user);
        return data;
      },
      async login(payload) {
        const data = await api.login(payload);
        setAuth(data.access_token, data.user);
        setUser(data.user);
        return data;
      },
      async logout() {
        try {
          await api.logout();
        } finally {
          clearAuth();
          setUser(null);
        }
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
