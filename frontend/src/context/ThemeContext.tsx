import {
 createContext,
 useCallback,
 useContext,
 useEffect,
 useMemo,
 useState,
 type ReactNode,
} from 'react';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'meddash.theme';

interface ThemeContextValue {
 theme: Theme;
 toggle: () => void;
 setTheme: (_t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
 const [theme, setThemeState] = useState<Theme>('light');

 useEffect(() => {
 const root = document.documentElement;
 root.classList.remove('dark');
 localStorage.setItem(STORAGE_KEY, 'light');
 }, [theme]);

 const setTheme = useCallback((t: Theme) => setThemeState(t), []);
 const toggle = useCallback(() => setThemeState((t) => (t === 'dark' ? 'light' : 'dark')), []);

 const value = useMemo(() => ({ theme, toggle, setTheme }), [theme, toggle, setTheme]);
 return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): ThemeContextValue {
 const ctx = useContext(ThemeContext);
 if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>.');
 return ctx;
}
