import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import toast from 'react-hot-toast';
import {
  authApi,
  onAuthEvent,
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
  ApiError,
} from '../api';
import type { AuthUser, LoginInput, RegisterInput } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY),
  );
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(token) && !user);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    return onAuthEvent((evt) => {
      if (evt === 'unauthorized') {
        logout();
        toast.error('Your session has expired. Please log in again.');
      }
    });
  }, [logout]);

  useEffect(() => {
    let cancelled = false;
    if (token && !user) {
      setIsLoading(true);
      authApi
        .me()
        .then((me) => {
          if (cancelled) return;
          setUser(me);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(me));
        })
        .catch(() => {
          if (cancelled) return;
          logout();
        })
        .finally(() => !cancelled && setIsLoading(false));
    } else {
      setIsLoading(false);
    }
    return () => {
      cancelled = true;
    };
  }, [token, user, logout]);

  const handleAuthSuccess = useCallback(
    (t: string, u: AuthUser) => {
      localStorage.setItem(TOKEN_STORAGE_KEY, t);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(u));
      setToken(t);
      setUser(u);
    },
    [],
  );

  const login = useCallback(
    async (input: LoginInput) => {
      try {
        const res = await authApi.login(input);
        handleAuthSuccess(res.token, res.user);
        toast.success(`Welcome back, ${res.user.name.split(' ')[0]}!`);
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : 'Login failed.';
        toast.error(msg);
        throw err;
      }
    },
    [handleAuthSuccess],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      try {
        const res = await authApi.register(input);
        handleAuthSuccess(res.token, res.user);
        toast.success('Account created — you are now signed in.');
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : 'Registration failed.';
        toast.error(msg);
        throw err;
      }
    },
    [handleAuthSuccess],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      register,
      logout,
    }),
    [user, token, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>.');
  return ctx;
}
