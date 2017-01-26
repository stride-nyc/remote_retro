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
		modulesDirectories: [ "node_modules", __dirname + "/web/static/js" ]
	},
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: "babel",
			query: {
				presets: ["es2015", "react"]
			}
		}, {
			test: /\.css$/,
			loader: ExtractTextPlugin.extract("style", "css")
		}]
	},
	devtool: "source-map",
	plugins: [
		new WebpackNotifierPlugin({ skipFirstNotification: true }),
		new ExtractTextPlugin("css/app.css"),
		new CopyWebpackPlugin([{ from: "./web/static/assets" }]),
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV)
			}
		}),
	]
}
