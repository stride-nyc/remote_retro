const path = require("path")
const webpack = require("webpack")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const WriteFileWebpackPlugin = require("write-file-webpack-plugin")

process.noDeprecation = true

const OUTPUT_PATH = `${__dirname}/priv/static`
const { CLOUDFRONT_DOMAIN } = process.env

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
        exclude: /(polyfills|node_modules\/(?!(react-helmet-async)\/).*)/,
        use: [{
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
              ["@babel/plugin-proposal-class-properties", { loose: true }],
              "@babel/plugin-proposal-object-rest-spread"
            ],
          }
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
    new webpack.DefinePlugin({
      ASSET_DOMAIN: CLOUDFRONT_DOMAIN ? `"https://${CLOUDFRONT_DOMAIN}"` : "''",
    }),
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
