import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const isWindows = process.platform === 'win32'
const npx = isWindows ? 'npx.cmd' : 'npx'

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: 'inherit',
    shell: isWindows,
  })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}

const remoteResult = spawnSync('git', ['remote', 'get-url', 'origin'], {
  cwd: root,
  encoding: 'utf8',
})

if (remoteResult.status !== 0 || !remoteResult.stdout.trim()) {
  console.error('Git remote origin پیدا نشد. ابتدا مخزن GitHub را با git remote add origin تنظیم کنید.')
  process.exit(1)
}

const remote = remoteResult.stdout.trim().replace(/[?#].*$/, '').replace(/\.git$/, '')
const match = remote.match(/(?:\/|:)([^/:]+)\/([^/:]+)$/)
if (!match) {
  console.error(`آدرس مخزن از origin تشخیص داده نشد: ${remote}`)
  process.exit(1)
}

const [, owner, repository] = match
const basePath = process.env.BASE_PATH || (repository.toLowerCase() === `${owner.toLowerCase()}.github.io` ? '/' : `/${repository}/`)

console.log(`Building GitHub Pages site with base path: ${basePath}`)
run(npx, ['vite', 'build', '--base', basePath])
run(process.execPath, ['scripts/spa-fallback.js'])
run(npx, ['--yes', 'gh-pages', '-d', 'dist'])

console.log(`\nDeploy command completed. Configure GitHub Pages to publish the gh-pages branch at https://${owner}.github.io/${repository.toLowerCase() === `${owner.toLowerCase()}.github.io` ? '' : `${repository}/`}`)
