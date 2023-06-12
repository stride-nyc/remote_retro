const webpack = require("webpack")
const webpackMerge = require("webpack-merge")
const WebpackNotifierPlugin = require("webpack-notifier")

const sharedConfig = require("./webpack.shared.config.js")

const DEV_SERVER_PORT = 8080
const OUTPUT_PUBLIC_PATH = `http://localhost:${DEV_SERVER_PORT}/`

module.exports = webpackMerge.merge(sharedConfig,{
  mode: "development",
  devtool: "source-map",
  entry: [
    "react-hot-loader/patch",
    `webpack-dev-server/client?${OUTPUT_PUBLIC_PATH}`,
    "webpack/hot/only-dev-server",
  ],
  output: {
    publicPath: OUTPUT_PUBLIC_PATH,
    hotUpdateChunkFilename: "hot/hot-update.js",
    hotUpdateMainFilename: "hot/hot-update.json",
  },
  devServer: {
    client:{
      overlay: true,
      clientLogLevel: "none",
    },
    devMiddleware:{
      publicPath: OUTPUT_PUBLIC_PATH,
      writeToDisk: true,
      stats: sharedConfig.stats,
    },
    static:{
      contentBase: sharedConfig.output.path,
    },
    port: DEV_SERVER_PORT
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
        ],
      },
    ],
  },
  plugins: [
    new WebpackNotifierPlugin({ skipFirstNotification: true }),
    new webpack.HotModuleReplacementPlugin(),
  ],
})
