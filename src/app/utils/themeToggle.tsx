'use client';
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun, faGear } from "@fortawesome/free-solid-svg-icons";

type Theme = 'light' | 'dark' | 'system';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) || 'system';
  });

  useEffect(() => {
    const updateTheme = (newTheme: Theme) => {
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem("theme", "dark");
      } else if (newTheme === 'light') {
        document.documentElement.classList.remove('dark');
        localStorage.setItem("theme", "light");
      } else {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (mediaQuery.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        localStorage.removeItem("theme");
      }
      console.log("Theme updated:", newTheme);
    };

    updateTheme(theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      if (theme === 'system') {
        updateTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, [theme]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <div className="flex items-center space-x-2">
      <FontAwesomeIcon 
        icon={faMoon} 
        className={`cursor-pointer ${theme === 'dark' ? 'text-yellow-400' : 'text-gray-400'}`} 
        onClick={() => handleThemeChange('dark')}
      />
      <FontAwesomeIcon 
        icon={faSun} 
        className={`cursor-pointer ${theme === 'light' ? 'text-yellow-400' : 'text-gray-400'}`} 
        onClick={() => handleThemeChange('light')}
      />
      <FontAwesomeIcon 
        icon={faGear} 
        className={`cursor-pointer ${theme === 'system' ? 'text-yellow-400' : 'text-gray-400'}`} 
        onClick={() => handleThemeChange('system')}
      />
    </div>
  );
};

export default ThemeToggle;