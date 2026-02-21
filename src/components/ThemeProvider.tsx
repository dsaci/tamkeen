import React, { useState, useEffect, ReactNode } from 'react';
import { ThemeContext, UITheme, themeStyles } from '../utils/theme';

interface ThemeProviderProps {
    children: ReactNode;
    initialTheme?: UITheme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, initialTheme = 'v1' }) => {
    const [theme, setTheme] = useState<UITheme>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('ui_theme') as UITheme;
            return saved && themeStyles[saved] ? saved : initialTheme;
        }
        return initialTheme;
    });

    useEffect(() => {
        localStorage.setItem('ui_theme', theme);
        // Apply theme-specific body classes if needed
        document.body.className = theme;
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <div className={`theme-${theme} min-h-screen transition-colors duration-300`}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};
