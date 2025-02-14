import webpack from "webpack"
import WebpackDevServer from "webpack-dev-server"
import config from "./webpack.dev.config.js"

console.log("[DEBUG] Starting webpack.devserver.js")

const compiler = webpack(config)
const devServerOptions = {
  ...config.devServer,
  hot: true,
  compress: true,
  client: {
    logging: "none",
    overlay: true,
  },
  headers: {
    "Access-Control-Allow-Origin": "*"
  },
  static: {
    publicPath: config.output.publicPath
  }
}

const server = new WebpackDevServer(devServerOptions, compiler)

async function cleanup() {
  console.log("[DEBUG] Cleanup function called")
  if (server) {
    console.log("[DEBUG] Attempting to stop webpack dev server...")
    try {
      await server.stop()
      console.log("[DEBUG] Server stop completed successfully")
    } catch (err) {
      console.error("[DEBUG] Error stopping webpack dev server:", err)
    }
  }
  console.log("[DEBUG] Cleanup complete, exiting...")
  process.exit(0)
}

// Log all received signals
process.on("SIGTERM", () => {
  console.log("[DEBUG] Received SIGTERM signal")
  cleanup()
})

process.on("SIGINT", () => {
  console.log("[DEBUG] Received SIGINT signal")
  cleanup()
})

process.on("SIGHUP", () => {
  console.log("[DEBUG] Received SIGHUP signal")
  cleanup()
})

// Handle STDIN end
process.stdin.resume()
process.stdin.on("end", () => {
  console.log("[DEBUG] Received STDIN end")
  cleanup()
})

// Log when process is about to exit
process.on("exit", (code) => {
  console.log(`[DEBUG] Process exit with code: ${code}`)
})

// Log any uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("[DEBUG] Uncaught exception:", err)
})

server.startCallback((err) => {
  if (err) {
    console.error("[DEBUG] Server start error:", err)
    process.exit(1)
  }
  console.log("[DEBUG] Webpack dev server started successfully")
  console.log("[info] Webpack compiling assets...\n")
})
