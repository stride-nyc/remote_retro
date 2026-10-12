const postCssImport = require("postcss-import")
const postCssNested = require("postcss-nested")
const postCssCssVariables = require("postcss-css-variables")
const autoPrefixer = require("autoprefixer")

module.exports = {
  plugins: [
    postCssImport,
    postCssNested,
    // preserve: true keeps the :root[data-theme="dark"] block and the var()
    // references (dark mode needs them resolved at runtime) while still emitting
    // the static fallback declaration first for IE 11
    postCssCssVariables({ preserve: true }),
    autoPrefixer,
  ],
}
