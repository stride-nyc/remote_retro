const webpack = require("webpack")
const webpackMerge = require("webpack-merge")
const WebpackNotifierPlugin = require("webpack-notifier")

const sharedConfig = require("./webpack.shared.config.js")

const DEV_SERVER_PORT = 8080
const OUTPUT_PUBLIC_PATH = `http://localhost:${DEV_SERVER_PORT}/`

module.exports = webpackMerge.smart({
  mode: "development",
  devtool: "source-map",
  entry: [
//    "react-hot-loader/patch",
    `webpack-dev-server/client?${OUTPUT_PUBLIC_PATH}`,
    "webpack/hot/only-dev-server",
  ],
  output: {
    publicPath: OUTPUT_PUBLIC_PATH,
    hotUpdateChunkFilename: "hot/hot-update.js",
    hotUpdateMainFilename: "hot/hot-update.json",
  },
  devServer: {
    port: DEV_SERVER_PORT,
    contentBase: sharedConfig.output.path,
    publicPath: OUTPUT_PUBLIC_PATH,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: "css-hot-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new WebpackNotifierPlugin({ skipFirstNotification: true }),
    new webpack.HotModuleReplacementPlugin(),
  ],
}, sharedConfig)
