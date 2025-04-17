
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type TextColor = 'default' | 'blue' | 'green' | 'purple' | 'red';

type ThemeContextType = {
  theme: Theme;
  textColor: TextColor;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setTextColor: (color: TextColor) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('bookmaster_theme');
    return (savedTheme as Theme) || 'light';
  });

  const [textColor, setTextColorState] = useState<TextColor>(() => {
    const savedColor = localStorage.getItem('bookmaster_text_color');
    return (savedColor as TextColor) || 'default';
  });

  useEffect(() => {
    localStorage.setItem('bookmaster_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('bookmaster_text_color', textColor);
    document.documentElement.setAttribute('data-text-color', textColor);
  }, [textColor]);

  const toggleTheme = () => {
    setThemeState(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setTextColor = (color: TextColor) => {
    setTextColorState(color);
  };

  return (
    <ThemeContext.Provider value={{ theme, textColor, toggleTheme, setTheme, setTextColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
