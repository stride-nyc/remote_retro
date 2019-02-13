"use strict"

const path = require("path")
const webpack = require("webpack")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const WriteFileWebpackPlugin = require("write-file-webpack-plugin")
const WebpackNotifierPlugin = require("webpack-notifier")
const HoneybadgerSourceMapPlugin = require("@honeybadger-io/webpack")

const { HOST, NODE_ENV, HONEYBADGER_API_KEY, npm_package_gitHead } = process.env

process.noDeprecation = true

const DEV_SERVER_PORT = 5001
const OUTPUT_PATH = `${__dirname}/priv/static`
const OUTPUT_PUBLIC_PATH = `http://localhost:${DEV_SERVER_PORT}/`
const PRODUCTION_ASSETS_URL = `https://${HOST}`

const inDev = NODE_ENV === "dev"
const forDeployedProduction = HOST === "remoteretro.org"

const devEntrypoints = [
  "react-hot-loader/patch",
  `webpack-dev-server/client?${OUTPUT_PUBLIC_PATH}`,
  "webpack/hot/only-dev-server",
]
const supplementalEntrypoints = inDev ? devEntrypoints : []

const productionOverrides = forDeployedProduction ? { devtool: "source-map" } : {}

const prodSourceMapPlugins = [
  new HoneybadgerSourceMapPlugin({
    apiKey: HONEYBADGER_API_KEY,
    assetsUrl: PRODUCTION_ASSETS_URL,
    revision: npm_package_gitHead,
  }),
]

const devSourceMapPlugins = [
  new webpack.SourceMapDevToolPlugin({
    test: /app\.js/,
    filename: "js/app.js.map",
    columns: false,
  }),
]

const sourceMapPlugins =
  forDeployedProduction ? prodSourceMapPlugins : devSourceMapPlugins

module.exports = {
  ...productionOverrides,
  mode: "development", // default, which is overriden for prod by passing flag to CLI
  entry: [
    ...supplementalEntrypoints,
    "./web/static/css/app.css",
    "./web/static/css/tiny_modal.css",
    "./web/static/js/app.js",
  ],
  stats: { modules: false, entrypoints: false, children: false },
  output: {
    path: OUTPUT_PATH,
    filename: "js/app.js",
    publicPath: OUTPUT_PUBLIC_PATH,
    hotUpdateChunkFilename: "hot/hot-update.js",
    hotUpdateMainFilename: "hot/hot-update.json",
  },
  devServer: {
    port: DEV_SERVER_PORT,
    contentBase: OUTPUT_PATH,
    publicPath: OUTPUT_PUBLIC_PATH,
  },
  resolve: {
    modules: ["node_modules", __dirname + "/web/static/js"],
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components|polyfills)/,
        use: [{
          loader: "babel-loader",
          query: {
            cacheDirectory: true,
          },
        }],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "css-hot-loader",
          },
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              camelCase: "only", // remove dashed class names from style object
              modules: true,
              importLoaders: 1,
              localIdentName: "[name]__[local]___[hash:base64:5]",
            },
          },
          {
            loader: "postcss-loader",
          },
        ],
      }
    ],
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: path.resolve(__dirname, "web/static/js"),
      manifest: require("./web/static/js/dll/vendor-manifest.json"),
    }),
    ...sourceMapPlugins,
    new WebpackNotifierPlugin({ skipFirstNotification: true }),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/app.css",
    }),
    new CopyWebpackPlugin([{
      from: "./web/static/assets",
      ignore: "**/.DS_Store",
    }]),
    new WriteFileWebpackPlugin([{ from: "./web/static/assets" }]),
  ],
}
