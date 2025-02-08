'use client';

import { useEffect, useState } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import type { ISourceOptions } from 'tsparticles-engine';

const getThemeFromLS = (): 'light' | 'dark' => {
  const theme = localStorage.getItem('heroui-theme');
  return theme === 'dark' ? 'dark' : 'light';
};

const getPrimaryColor = (theme: 'light' | 'dark'): string => {
  return theme === 'dark' ? '#1a1a1a' : '#9353d3';
};

export const BackgroundParticles = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [valorPrimario, setValorPrimario] = useState<string>('#9353d3');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = getThemeFromLS();
      setTheme(savedTheme);
      setValorPrimario(getPrimaryColor(savedTheme));
    }
  }, []);

  useEffect(() => {
    console.log('Iniciando listener para cambios en localStorage');

    const handleStorageChange = (event: Event) => {
      let key: string | null = null;
      let newValue: string | null = null;

      if ((event as StorageEvent).key !== undefined) {
        const se = event as StorageEvent;
        key = se.key;
        newValue = se.newValue;
      } else {
        const ce = event as CustomEvent;
        key = ce.detail.key;
        newValue = ce.detail.newValue;
      }

      if (key === 'heroui-theme') {
        const newTheme: 'light' | 'dark' =
          newValue === 'dark' ? 'dark' : 'light';
        console.log(
          'Detectado cambio en localStorage: heroui-theme =',
          newTheme
        );
        setTheme(newTheme);
        setValorPrimario(getPrimaryColor(newTheme));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    window.addEventListener(
      'localStorageChange',
      handleStorageChange as EventListener
    );

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(
        'localStorageChange',
        handleStorageChange as EventListener
      );
    };
  }, []);

  useEffect(() => {
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key: string, value: string) {
      originalSetItem.apply(this, [key, value]);
      const event = new CustomEvent('localStorageChange', {
        detail: { key, newValue: value },
      });
      console.log('localStorage.setItem disparado: ', key, value);
      window.dispatchEvent(event);
    };

    return () => {
      localStorage.setItem = originalSetItem;
    };
  }, []);

  const particlesOptions: ISourceOptions = {
    autoPlay: true,
    background: {
      color: { value: 'transparent' },
    },
    fullScreen: { enable: true, zIndex: -10 },
    detectRetina: true,
    fpsLimit: 240,
    interactivity: {
      detectsOn: 'window' as const,
      events: {
        onClick: { enable: false, mode: 'push' as const },
        onHover: {
          enable: true,
          mode: 'grab' as const,
          parallax: { enable: true, force: 60, smooth: 10 },
        },
        resize: { delay: 0.5, enable: true },
      },
      modes: {
        push: { default: true, quantity: 4 },
      },
    },
    particles: {
      number: {
        value: 100,
        density: { enable: true, width: 1920, height: 1080 },
      },
      shape: {
        type: 'circle' as const,
        stroke: {
          width: 1,
          color: theme === 'dark' ? '#FFFFFF' : '#808080',
        },
      },
      opacity: {
        value: { min: 0.1, max: 0.5 },
        animation: {
          enable: true,
          speed: 1,
          sync: false,
          mode: 'auto' as const,
          startValue: 'random' as const,
        },
      },
      size: {
        value: { min: 1, max: 5 },
        animation: {
          enable: true,
          speed: 20,
          sync: false,
          mode: 'auto' as const,
          startValue: 'random' as const,
        },
      },
      move: {
        enable: true,
        speed: 2,
        direction: 'bottom' as const,
        outModes: { default: 'out' as const },
        random: false,
        straight: false,
      },
      links: {
        color: theme === 'dark' ? '#FFFFFF' : '#808080',
        enable: true,
        distance: 200,
        opacity: 0.4,
        width: 1,
      },
      bounce: {
        horizontal: { value: 1 },
        vertical: { value: 1 },
      },
      color: {
        value: valorPrimario,
        animation: {
          h: { enable: false },
          s: { enable: false },
          l: { enable: false },
        },
      },
    },
    pauseOnBlur: true,
    pauseOnOutsideViewport: true,
    motion: { disable: false, reduce: { factor: 4, value: true } },
    key: 'parallax',
    name: 'Parallax',
    zLayers: 100,
  };

  return (
    <div>
      <Particles
        key={valorPrimario}
        id='tsparticles'
        init={loadFull}
        options={particlesOptions}
      />
    </div>
  );
};
