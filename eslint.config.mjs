import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

// eslint-config-next@16 ya expone flat config nativa: se componen spreando
// los arrays. (Envolverlas en FlatCompat es lo que rompía con "circular JSON".)
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "next-env.d.ts",
    ],
  },
  ...coreWebVitals,
  ...typescript,
  {
    // El ruleset del React Compiler (react-hooks v6) que trae Next 16 marca
    // como error dos patrones que aquí son intencionales y correctos:
    //  - set-state-in-effect: el "mount guard" para evitar mismatch de
    //    hidratación con el tema (patrón recomendado por next-themes).
    //  - preserve-manual-memoization: memoización manual en el componente
    //    compound Dropdown hecho a mano.
    // Los dejamos visibles como advertencia, no como bloqueo.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
    },
  },
];

export default eslintConfig;
