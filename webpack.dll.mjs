import path from "path"
import webpack from "webpack"

process.noDeprecation = true

export default {
  mode: "development", // default, which is overriden for prod by passing flag to CLI
  entry: {
    vendor: ["./web/static/js/vendor"],
  },
  stats: "errors-only",
  output: {
    path: path.resolve(path.dirname(new URL(import.meta.url).pathname), "priv/static/js/dll"),
    filename: "dll.[name].js",
    library: "[name]",
  },
  cache: {
    type: "filesystem",
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(path.dirname(new URL(import.meta.url).pathname), "web/static/js/dll", "[name]-manifest.json"),
      name: "[name]",
      context: path.resolve(path.dirname(new URL(import.meta.url).pathname), "web/static/js"),
    }),
  ],
  resolve: {
    modules: ["node_modules"],
    // fullySpecified: false,
    extensions: [".js", ".jsx"],
  },
}
