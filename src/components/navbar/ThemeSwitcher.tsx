'use client';

import { Switch } from '@heroui/react';
import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from './utils/Icon';

let useTheme: typeof import('@heroui/use-theme').useTheme;
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  ({ useTheme } = require('@heroui/use-theme'));
} else {
  useTheme = () => ({
    theme: 'dark',
    setTheme: () => {},
  });
}

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return <div className='theme-switcher-placeholder' />;
  }

  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Switch
      isSelected={theme === 'light'}
      size='md'
      color='primary'
      onChange={handleToggleTheme}
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <SunIcon className={className} />
        ) : (
          <MoonIcon className={className} />
        )
      }
    />
  );
};
