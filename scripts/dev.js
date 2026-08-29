// Root developer script.
//
// Starts the Express backend (port 4000) and the Vite frontend (port 5173)
// together so the whole app can run from a single `npm start` at the root.
// No third-party dependencies are needed — only Node's built-in child_process.

const { spawn } = require('node:child_process')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function start(label, command, args, cwd, useShell = false) {
  console.log(`[${label}] starting...`)
  const child = spawn(command, args, {
    cwd,
    stdio: 'inherit',
    env: process.env,
    shell: useShell,
  })

  child.on('error', (error) => {
    console.error(`[${label}] failed to start: ${error.message}`)
  })

  child.on('exit', (code) => {
    console.log(`[${label}] exited with code ${code ?? 'null'}`)
  })

  return child
}

// node.exe can be spawned directly (no shell). npm is a .cmd on Windows and
// needs cmd.exe to launch it.
const backend = start(
  'backend',
  process.execPath,
  ['src/server.js'],
  path.join(root, 'backend'),
  false
)
const frontend = start(
  'frontend',
  npmCmd,
  ['run', 'dev'],
  path.join(root, 'frontend'),
  process.platform === 'win32'
)

let shuttingDown = false
function shutdown() {
  if (shuttingDown) {
    return
  }
  shuttingDown = true
  console.log('\nShutting down...')
  backend.kill('SIGTERM')
  frontend.kill('SIGTERM')
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

console.log('\n  AI Study Assistant')
console.log('  Frontend  → http://localhost:5173')
console.log('  Backend   → http://localhost:4000\n')
console.log('  Press Ctrl+C to stop.\n')