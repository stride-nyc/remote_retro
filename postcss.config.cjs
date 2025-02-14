const postCssImport = require("postcss-import")
const postCssNested = require("postcss-nested")
const postCssCssVariables = require("postcss-css-variables")
const autoPrefixer = require("autoprefixer")

module.exports = {
  plugins: [
    postCssImport,
    postCssNested,
    postCssCssVariables(),
    autoPrefixer,
  ],
}
