import webpack from "webpack"
import { smart as webpackMergeSmart } from "webpack-merge"
import WebpackNotifierPlugin from "webpack-notifier"

import sharedConfig from "./webpack.shared.config.js"

const DEV_SERVER_PORT = 8080
const OUTPUT_PUBLIC_PATH = `http://localhost:${DEV_SERVER_PORT}/`

export default webpackMergeSmart({
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
    port: DEV_SERVER_PORT,
    static: {
      directory: sharedConfig.output.path,
      publicPath: OUTPUT_PUBLIC_PATH,
    },
    hot: true,
    compress: true,
    client: {
      overlay: true,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    devMiddleware: {
      publicPath: OUTPUT_PUBLIC_PATH,
    },
    allowedHosts: 'all',
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
      {
        test: /\.m?js/,
        type: "javascript/auto",
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  plugins: [
    new WebpackNotifierPlugin({ skipFirstNotification: true }),
    new webpack.HotModuleReplacementPlugin(),
  ],
}, sharedConfig)
