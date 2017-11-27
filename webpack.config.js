"use strict"

const path = require("path")
const webpack = require("webpack")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const WebpackNotifierPlugin = require("webpack-notifier")

process.noDeprecation = true

const DEV_SERVER_PORT = 5001
const OUTPUT_PATH = `${__dirname}/priv/static`
const OUTPUT_PUBLIC_PATH = `http://localhost:${DEV_SERVER_PORT}/`

const inDev = process.env.NODE_ENV === "dev"
const devEntrypoints = [
  "react-hot-loader/patch",
  `webpack-dev-server/client?${OUTPUT_PUBLIC_PATH}`,
  "webpack/hot/only-dev-server",
]
const supplementalEntrypoints = inDev ? devEntrypoints : []

module.exports = {
  cache: true,
  entry: [
    ...supplementalEntrypoints,
    "./web/static/css/app.css",
    "./web/static/css/tiny_modal.css",
    "./web/static/js/app.js"
  ],
  output: {
    path: OUTPUT_PATH,
    filename: "js/app.js",
    publicPath: OUTPUT_PUBLIC_PATH,
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
    rules: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components|polyfills)/,
      use: [{
        loader: "babel-loader",
        query: {
          cacheDirectory: true
        },
      }],
    }, {
      test: /\.css$/,
      use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: [
          {
            loader: 'css-loader',
            options: {
              camelCase: 'only', // remove dashed class names from style object
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader',
          }
        ]
      })),
    }]
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: path.resolve(__dirname, "web/static/js"),
      manifest: require("./web/static/js/dll/vendor-manifest.json")
    }),
    new webpack.SourceMapDevToolPlugin({
      test: /app\.js/,
      filename: "js/app.js.map",
      columns: false,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new WebpackNotifierPlugin({ skipFirstNotification: true }),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin({ filename: "css/app.css" }),
    new CopyWebpackPlugin([{ from: "./web/static/assets" }]),
  ]
}
