const globals = require("globals");
const pluginJs = require("@eslint/js");
const pluginSecurity = require('eslint-plugin-security');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  pluginSecurity.configs.recommended
];