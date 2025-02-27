const globals = require("globals");
const pluginJs = require("@eslint/js");
const pluginSecurity = require('eslint-plugin-security');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  {
    files: ["**/*.js"], // Aplica a todos los archivos .js
    languageOptions: {
      sourceType: "commonjs", // Permite importar módulos de CommonJS
      globals: {
        ...globals.browser, // Si necesitas variables globales de navegador, las puedes mantener
        process: "readonly", // Permite la variable global 'process' de Node.js
        __dirname: "readonly",
        Buffer: "readonly", // Permite la variable global '__dirname' de Node.js
      },
    },
  },
  {
    files: ["src/**/*.js"], // Aplica a los archivos en la carpeta frontend
    languageOptions: {
      sourceType: "module", // Usar ESM (import/export) para el frontend
      globals: {
        ...globals.browser,
        Chart: "readonly" // Agregar variables globales de navegador si es necesario
      },
    },
  },
  pluginJs.configs.recommended,
  pluginSecurity.configs.recommended,
];
