"use strict"

const path = require("path")
const webpack = require("webpack")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const WebpackNotifierPlugin = require("webpack-notifier")

module.exports = {
  cache: true,
  entry: [
    "./web/static/js/polyfills/array.find",
    "./web/static/js/polyfills/array.find_index",
    "./web/static/css/app.css",
    "./web/static/js/app.js"
  ],
  output: {
    path: __dirname + "/priv/static",
    filename: "js/app.js"
  },
  resolve: {
    modules: ["node_modules", __dirname + "/web/static/js"],
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      use: [{
        loader: "babel-loader",
        query: {
          cacheDirectory: true
        },
      }],
    }, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
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
         }
       ]
      }),
    }]
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: path.resolve(__dirname, "web/static/js"),
      manifest: require("./web/static/js/dll/vendor-manifest.json")
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: "js/app.js.map",
      columns: false,
      exclude: /vendor/
    }),
    new WebpackNotifierPlugin({ skipFirstNotification: true }),
    new ExtractTextPlugin({ filename: "css/app.css" }),
    new CopyWebpackPlugin([{ from: "./web/static/assets" }]),
  ]
}
