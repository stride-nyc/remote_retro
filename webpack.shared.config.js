const path = require("path")
const webpack = require("webpack")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const WriteFileWebpackPlugin = require("write-file-webpack-plugin")

process.noDeprecation = true

const OUTPUT_PATH = `${__dirname}/priv/static`

module.exports = {
  mode: "development",
  entry: [
    "./web/static/css/app.css",
    "./web/static/css/tiny_modal.css",
    "./web/static/js/app.js",
  ],
  stats: { modules: false, entrypoints: false, children: false },
  output: {
    path: OUTPUT_PATH,
    filename: "js/app.js",
  },
  resolve: {
    modules: ["node_modules", `${__dirname}/web/static/js`],
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|polyfills)/,
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
      },
    ],
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: path.resolve(__dirname, "web/static/js"),
      manifest: require("./web/static/js/dll/vendor-manifest.json"),
    }),
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
