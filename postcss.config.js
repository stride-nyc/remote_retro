const postCssCssVariables = require("postcss-css-variables")
const postCssNested = require("postcss-nested")

module.exports = {
  plugins: [
    postCssCssVariables,
    postCssNested,
  ],
}
