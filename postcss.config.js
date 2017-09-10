const postCssNested = require("postcss-nested")
const postCssCssVariables = require("postcss-css-variables")

module.exports = {
  plugins: [
    postCssNested,
    postCssCssVariables,
  ],
}
