"use strict"

const webpack = require("webpack")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const WebpackNotifierPlugin = require("webpack-notifier")

module.exports = {
  entry: ["./web/static/css/app.css", "./web/static/js/app.js"],
  output: {
    path: "./priv/static",
    filename: "js/app.js"
  },
  resolve: {
    modules: ["node_modules", __dirname + "/web/static/js"],
    extensions: [".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({ fallback: "style-loader", use: "css-loader" })
      }
    ]
  },
  devtool: "source-map",
  plugins: [
    new WebpackNotifierPlugin({ skipFirstNotification: true }),
    new ExtractTextPlugin({ filename: "css/app.css" }),
    new CopyWebpackPlugin([{ from: "./web/static/assets" }]),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
  ]
}
