var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require("path");

module.exports = {
  entry: {
    "app": ["./web/static/css/app.scss", "./web/static/js/app.js"],
  },

  output: {
    path: "./priv/static",
    filename: "js/app.js"
  },

  resolve: {
    moduleDirectories: [ __dirname ]
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel",
        include: __dirname
      }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style", "css")
      }, {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          "style",
          "css!sass?includePaths[]=" + __dirname +  "/node_modules"
        )
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin("css/app.css")
  ]
}
