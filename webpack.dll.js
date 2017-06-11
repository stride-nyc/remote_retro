const path = require("path")
const webpack = require("webpack")

module.exports = {
  cache: true,
  entry: {
    vendor: ["./web/static/js/vendor"],
  },
  output: {
    path: path.resolve(__dirname, "priv/static/js/dll"),
    filename: "dll.[name].js",
    library: "[name]",
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(__dirname, "web/static/js/dll", "[name]-manifest.json"),
      name: "[name]",
      context: path.resolve(__dirname, "web/static/js"),
    }),
  ],
  resolve: {
    modules: ["node_modules"],
  },
}
