import path from "path"
import webpack from "webpack"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import CopyWebpackPlugin from "copy-webpack-plugin"
import vendorManifest from "./web/static/js/dll/vendor-manifest.json" with { type: "json" }

process.noDeprecation = true

const OUTPUT_PATH = `${path.dirname(new URL(import.meta.url).pathname)}/priv/static`
const { CLOUDFRONT_DOMAIN } = process.env

export default {
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
    modules: ["node_modules", `${path.dirname(new URL(import.meta.url).pathname)}/web/static/js`],
    extensions: [".js", ".jsx"],
    fullySpecified: false,
    fallback: {
      "core-js": false,
      "url": false
    }
  },
  cache: false,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|polyfills)/,
        use: [{
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
          },
        }],
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        },
        include: [
          path.resolve(path.dirname(new URL(import.meta.url).pathname), "web/static/js"),
          path.resolve(path.dirname(new URL(import.meta.url).pathname), "node_modules")
        ],
        type: "javascript/auto"
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
      context: path.resolve(path.dirname(new URL(import.meta.url).pathname), "web/static/js"),
      manifest: vendorManifest,
    }),
    new MiniCssExtractPlugin({
      filename: "css/app.css",
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: "./web/static/assets",
        globOptions: {
          ignore: ["**/.DS_Store"],
        },
      }]
    }),
  ],
}
