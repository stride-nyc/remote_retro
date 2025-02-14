import postCssImport from "postcss-import"
import postCssNested from "postcss-nested"
import postCssCssVariables from "postcss-css-variables"
import autoPrefixer from "autoprefixer"

export default {
  plugins: [
    postCssImport,
    postCssNested,
    postCssCssVariables(),
    autoPrefixer,
  ],
}
