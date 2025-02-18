const path = require("path")
const webpack = require("webpack")
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin")

process.noDeprecation = true

module.exports = {
  mode: "development", // default, which is overriden for prod by passing flag to CLI
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
    new HardSourceWebpackPlugin({ info: { level: "error" } }),
    new webpack.DllPlugin({
      path: path.resolve(__dirname, "web/static/js/dll", "[name]-manifest.json"),
      name: "[name]",
      context: path.resolve(__dirname, "web/static/js"),
    }),
  ],
  resolve: {
    modules: ["node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(polyfills|node_modules\/(?!(react-helmet-async)\/).*)/,
        use: [{
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
              ["@babel/plugin-proposal-class-properties", { loose: true }],
              "@babel/plugin-proposal-object-rest-spread",
            ],
          },
        }],
      },
    ],
  },
}
