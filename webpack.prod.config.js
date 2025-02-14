import webpack from "webpack"
import { smart as webpackMergeSmart } from "webpack-merge"
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin"
import TerserPlugin from "terser-webpack-plugin"
import HoneybadgerSourceMapPlugin from "@honeybadger-io/webpack"

import sharedConfig from "./webpack.shared.config"

const { HOST, HONEYBADGER_API_KEY, npm_package_gitHead, revision } = process.env

const PRODUCTION_ASSETS_URL = `https://${HOST}`

export default webpackMergeSmart(sharedConfig, {
  mode: "production",
  devtool: "source-map",
  optimization: {
    minimizer: [
      new TerserPlugin({ sourceMap: true, parallel: true }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  plugins: [
    HONEYBADGER_API_KEY && new HoneybadgerSourceMapPlugin({
      apiKey: HONEYBADGER_API_KEY,
      assetsUrl: PRODUCTION_ASSETS_URL,
      revision,
    }),
  ].filter(Boolean),
})
