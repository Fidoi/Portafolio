"use client";

import { useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { ISourceOptions } from "tsparticles-engine";

// Detecta el tema actual según la clase 'dark' en el html
const getThemeFromDOM = (): "light" | "dark" => {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

// Colores según el tema (ajustados para modo claro)
const getParticleColor = (theme: "light" | "dark") =>
  theme === "dark" ? "#1a1a1a" : "#9353d3";
const getLinkColor = (theme: "light" | "dark") =>
  theme === "dark" ? "#FFFFFF" : "#1a1a1a";
const getStrokeColor = (theme: "light" | "dark") =>
  theme === "dark" ? "#FFFFFF" : "#9353d3";

export const BackgroundParticles = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [particleColor, setParticleColor] = useState("#9353d3");

  // Efecto inicial y observador de cambios en la clase 'dark'
  useEffect(() => {
    const updateTheme = () => {
      const newTheme = getThemeFromDOM();
      setTheme(newTheme);
      setParticleColor(getParticleColor(newTheme));
    };

    updateTheme(); // Setear estado inicial

    // Observar cambios en el atributo class del html
    const observer = new MutationObserver(() => {
      updateTheme();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Opciones de partículas (se recalcula en cada cambio de theme/color)
  const particlesOptions: ISourceOptions = {
    autoPlay: true,
    background: { color: { value: "transparent" } },
    fullScreen: { enable: true, zIndex: -10 },
    detectRetina: true,
    fpsLimit: 240,
    interactivity: {
      detectsOn: "window",
      events: {
        onClick: { enable: false, mode: "push" },
        onHover: {
          enable: true,
          mode: "grab",
          parallax: { enable: true, force: 60, smooth: 10 },
        },
        resize: { delay: 0.5, enable: true },
      },
      modes: { push: { default: true, quantity: 4 } },
    },
    particles: {
      number: {
        value: 100,
        density: { enable: true, width: 1920, height: 1080 },
      },
      shape: {
        type: "circle",
        stroke: {
          width: 1,
          color: getStrokeColor(theme),
        },
      },
      opacity: {
        value: { min: 0.1, max: 0.5 },
        animation: {
          enable: true,
          speed: 1,
          sync: false,
          mode: "auto",
          startValue: "random",
        },
      },
      size: {
        value: { min: 1, max: 5 },
        animation: {
          enable: true,
          speed: 20,
          sync: false,
          mode: "auto",
          startValue: "random",
        },
      },
      move: {
        enable: true,
        speed: 2,
        direction: "bottom",
        outModes: { default: "out" },
        random: false,
        straight: false,
      },
      links: {
        color: getLinkColor(theme),
        enable: true,
        distance: 200,
        opacity: 0.4,
        width: 1,
      },
      bounce: { horizontal: { value: 1 }, vertical: { value: 1 } },
      color: {
        value: particleColor,
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
    key: "parallax",
    name: "Parallax",
    zLayers: 100,
  };

  return (
    <Particles
      key={particleColor}
      id="tsparticles"
      init={loadFull}
      options={particlesOptions}
    />
  );
};
