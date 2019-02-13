const webpack = require("webpack")
// eslint-disable-next-line import/no-extraneous-dependencies
const WebpackDevServer = require("webpack-dev-server")
const config = require("./webpack.config")

const { port } = config.devServer

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  compress: true,
  clientLogLevel: "none",
  overlay: true,
  headers: { "Access-Control-Allow-Origin": "*" },
  stats: { modules: false, entrypoints: false, children: false },
}).listen(port, "0.0.0.0", err => {
  if (err) console.error(err)
  console.log(`[info] Running webpack-dev-server using http://localhost:${port}`)
  console.log("[info] Webpack compiling assets...\n")
})

// Exit on end of STDIN
process.stdin.resume()
process.stdin.on("end", () => {
  process.exit(0)
})
