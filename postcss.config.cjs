const postCssImport = require("postcss-import")
const postCssNested = require("postcss-nested")
const postCssCssVariables = require("postcss-css-variables")
const autoPrefixer = require("autoprefixer")
const purgecss = require("@fullhuman/postcss-purgecss")

module.exports = {
  plugins: [
    postCssImport,
    postCssNested,
    postCssCssVariables(),
    autoPrefixer,
    // Only run purgecss on semantic-ui CSS files
    process.env.NODE_ENV === "test" && purgecss({
      content: ["./web/static/js/**/*.{js,jsx}"],
      safelist: {
        standard: [/^ui-/, /^icon-/],
        deep: [/semantic/],
      },
    }),
  ].filter(Boolean), // Remove false values from plugins array
}
