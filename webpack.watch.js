import { spawn } from 'child_process'

console.log('[DEBUG] Starting webpack watch process')

let dllProcess = null
let devServerProcess = null
let semanticProcess = null

// Function to kill a process and its children
const killProcess = (proc, name) => {
  if (proc) {
    try {
      console.log(`[DEBUG] Killing ${name} process group ${-proc.pid}`)
      process.kill(-proc.pid)
    } catch (err) {
      if (err.code !== 'ESRCH') {
        console.error(`[DEBUG] Error killing ${name}:`, err)
      }
    }
  }
}

// Function to clean up all processes
const cleanup = () => {
  console.log('[DEBUG] Cleaning up processes...')
  
  killProcess(devServerProcess, 'webpack-dev-server')
  killProcess(dllProcess, 'webpack-dll')
  killProcess(semanticProcess, 'semantic-ui-watcher')

  // Exit after a short delay to ensure cleanup
  setTimeout(() => {
    console.log('[DEBUG] Exiting main process')
    process.exit(0)
  }, 100)
}

// Handle signals
process.on('SIGTERM', cleanup)
process.on('SIGINT', cleanup)
process.on('SIGHUP', cleanup)
process.stdin.on('end', cleanup)

// Handle process errors
process.on('uncaughtException', (err) => {
  console.error('[DEBUG] Uncaught exception:', err)
  cleanup()
})

process.on('unhandledRejection', (err) => {
  console.error('[DEBUG] Unhandled rejection:', err)
  cleanup()
})

// Start semantic-ui watcher
console.log('[DEBUG] Starting semantic-ui watcher')
semanticProcess = spawn('npm', ['run', 'watch-semantic-ui'], {
  stdio: 'inherit',
  detached: true
})

console.log(`[DEBUG] Started semantic-ui watcher with PID ${semanticProcess.pid}`)

// Start webpack dll build
console.log('[DEBUG] Starting DLL build')
dllProcess = spawn('webpack', ['--config=webpack.dll.mjs'], {
  stdio: 'inherit',
  detached: true
})

console.log(`[DEBUG] Started webpack dll build with PID ${dllProcess.pid}`)

dllProcess.on('exit', (code) => {
  if (code === 0) {
    console.log('[DEBUG] DLL build completed, starting dev server')
    
    // Start webpack-dev-server
    devServerProcess = spawn('node', ['webpack.devserver.js'], {
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'dev' },
      detached: true
    })

    console.log(`[DEBUG] Started webpack-dev-server with PID ${devServerProcess.pid}`)

    devServerProcess.on('exit', (code) => {
      console.log(`[DEBUG] Webpack dev server exited with code ${code}`)
      cleanup()
    })
  } else {
    console.error('[DEBUG] DLL build failed')
    cleanup()
  }
})

// Handle process exit
process.on('exit', () => {
  console.log('[DEBUG] Process exit handler')
  cleanup()
})
