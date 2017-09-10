const postCssImport = require("postcss-import")
const postCssNested = require("postcss-nested")
const postCssCssVariables = require("postcss-css-variables")

module.exports = {
  plugins: [
    postCssImport,
    postCssNested,
    postCssCssVariables(),
  ],
}
