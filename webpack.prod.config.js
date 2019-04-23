const webpack = require("webpack")
const webpackMerge = require("webpack-merge")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const HoneybadgerSourceMapPlugin = require("@honeybadger-io/webpack")

const sharedConfig = require("./webpack.shared.config.js")

const { HOST, HONEYBADGER_API_KEY, npm_package_gitHead: revision } = process.env

const PRODUCTION_ASSETS_URL = `https://${HOST}`

module.exports = webpackMerge.smart(sharedConfig, {
  mode: "production",
  devtool: "source-map",
  optimization: {
    minimizer: [
      new TerserPlugin({ sourceMap: true, parallel: true }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  plugins: [
    new HoneybadgerSourceMapPlugin({
      apiKey: HONEYBADGER_API_KEY,
      assetsUrl: PRODUCTION_ASSETS_URL,
      revision,
    }),
  ],
})
