const webpack = require("webpack")
// eslint-disable-next-line import/no-extraneous-dependencies
const WebpackDevServer = require("webpack-dev-server")
const config = require("./webpack.dev.config.js")

const { port } = config.devServer

const server = new WebpackDevServer({
  host: "0.0.0.0",
  port,
  hot: true,
  compress: true,
  client: {
    logging: "none",
    overlay: true,
  },
  headers: { "Access-Control-Allow-Origin": "*" },
  devMiddleware: {
    publicPath: config.output.publicPath,
    stats: config.stats,
  },
}, webpack(config))

server.start().then(() => {
  console.log("[info] Webpack compiling assets...\n")
}).catch(err => {
  console.error(err)
})

// Exit on end of STDIN
process.stdin.resume()
process.stdin.on("end", () => {
  process.exit(0)
})
