const webpack = require("webpack")
// eslint-disable-next-line import/no-extraneous-dependencies
const WebpackDevServer = require("webpack-dev-server")
const config = require("./webpack.dev.config")

const { port } = config.devServer

new WebpackDevServer(webpack(config), {
  hot: true,
  headers: { "Access-Control-Allow-Origin": "*" },
}).listen(port, "0.0.0.0", err => {
  if (err) {
    console.error(err)
  } else {
    console.log("[info] Webpack compiling assets...\n")
  }
})

// Exit on end of STDIN
process.stdin.resume()
process.stdin.on("end", () => {
  process.exit(0)
})
