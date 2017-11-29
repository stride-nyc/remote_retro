const path = require("path")
const webpack = require("webpack")
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin")

process.noDeprecation = true

module.exports = {
  cache: true,
  entry: {
    vendor: ["./web/static/js/vendor"],
  },
  stats: "errors-only",
  output: {
    path: path.resolve(__dirname, "priv/static/js/dll"),
    filename: "dll.[name].js",
    library: "[name]",
  },
  plugins: [
    new HardSourceWebpackPlugin(),
    new webpack.DllPlugin({
      path: path.resolve(__dirname, "web/static/js/dll", "[name]-manifest.json"),
      name: "[name]",
      context: path.resolve(__dirname, "web/static/js"),
    }),
    new webpack.DefinePlugin({
      __REACT_DEVTOOLS_GLOBAL_HOOK__: "({ isDisabled: true })",
    }),
  ],
  resolve: {
    modules: ["node_modules"],
  },
}
