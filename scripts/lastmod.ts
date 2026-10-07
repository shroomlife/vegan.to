import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import type { TopicName } from '../src/data/topics.ts'

/**
 * The date a route last changed, for the sitemap's <lastmod>.
 *
 * Google only trusts lastmod while it is demonstrably right, and a build date
 * stamped on every page at every deploy is not. So the date of a route is the
 * last commit that touched the files the route is rendered from: its view and,
 * transitively, everything the view imports from the app (data, components,
 * composables). The site's shell (App.vue, header, footer, the stylesheets) is
 * not imported by a view and so does not count: a restyle of the frame is not
 * a change of the page.
 */

const ROOT = resolve(import.meta.dirname, '..')

/** The view behind every topic route; the router keeps the same record for the lazy imports */
const topicViews: Record<TopicName, string> = {
  World: 'src/views/topics/WorldView.vue',
  Livestock: 'src/views/topics/LivestockView.vue',
  SlaughterAge: 'src/views/topics/SlaughterAgeView.vue',
  PerCapita: 'src/views/topics/PerCapitaView.vue',
  SlaughterStats: 'src/views/topics/SlaughterStatsView.vue',
  Chicks: 'src/views/topics/ChicksView.vue',
  Dairy: 'src/views/topics/DairyView.vue',
  Losses: 'src/views/topics/LossesView.vue',
  Transport: 'src/views/topics/TransportView.vue',
  Stunning: 'src/views/topics/StunningView.vue',
  Comparison: 'src/views/topics/ComparisonView.vue',
  Timeline: 'src/views/topics/ZeitreiseView.vue',
}

/** The files a route starts from: the view, plus the head of index.html for the start page (its schema.org graph) */
export function routeEntryFiles(path: string, topicNameByPath: ReadonlyMap<string, TopicName>): string[] {
  if (path === '/') return ['src/views/HomeView.vue', 'index.html']
  if (path === '/tiere') return ['src/views/SpeciesIndexView.vue']
  if (path.startsWith('/tiere/')) return ['src/views/SpeciesView.vue']
  if (path === '/quellen') return ['src/views/SourcesView.vue']
  if (path === '/impressum') return ['src/views/ImprintView.vue']
  if (path === '/datenschutz') return ['src/views/PrivacyView.vue']
  const topic = topicNameByPath.get(path)
  if (topic) return [topicViews[topic]]
  throw new Error(`lastmod: no view known for route ${path}`)
}

const IMPORT = /from\s+['"](@\/[^'"]+|\.\.?\/[^'"]+)['"]/g

/** Turns an import specifier into a repo-relative file, or null when it is not a source file of the app */
function resolveImport(fromFile: string, specifier: string): string | null {
  const base = specifier.startsWith('@/') ? resolve(ROOT, 'src', specifier.slice(2)) : resolve(ROOT, dirname(fromFile), specifier)
  for (const candidate of [base, `${base}.ts`, `${base}.vue`, `${base}/index.ts`]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return relative(ROOT, candidate).replace(/\\/g, '/')
  }
  return null
}

/** Every app file a set of entry files imports, transitively, the entries included */
export function contentFiles(entries: readonly string[]): string[] {
  const seen = new Set<string>()
  const queue = [...entries]
  while (queue.length > 0) {
    const file = queue.shift()
    if (!file || seen.has(file)) continue
    seen.add(file)
    if (!/\.(vue|ts)$/.test(file)) continue
    const source = readFileSync(resolve(ROOT, file), 'utf-8')
    for (const match of source.matchAll(IMPORT)) {
      const target = resolveImport(file, match[1] ?? '')
      if (target && !seen.has(target)) queue.push(target)
    }
  }
  return [...seen].sort()
}

function git(args: readonly string[]): string {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf-8' }).trim()
}

/**
 * Fails early when the checkout has no history: every route would then carry
 * the date of the boundary commit. The message names what the runner holds,
 * so a failing build can be read without a second run.
 */
export function assertFullHistory(): void {
  const shallow = git(['rev-parse', '--is-shallow-repository'])
  if (shallow === 'false') return
  const commits = git(['rev-list', '--count', 'HEAD'])
  const boundary = existsSync(resolve(ROOT, '.git/shallow'))
    ? readFileSync(resolve(ROOT, '.git/shallow'), 'utf-8').trim().split('\n').join(' ')
    : '(no .git/shallow)'
  throw new Error(
    `lastmod: the sitemap needs the full history, but the checkout is shallow: ` +
      `${commits} commits reachable from HEAD, shallow boundary ${boundary}, ${git(['--version'])}. ` +
      `Complete it first (git fetch --unshallow) or check out with the full history.`,
  )
}

/** ISO date (YYYY-MM-DD) of the last commit that touched any of the files */
export function lastCommitDate(files: readonly string[]): string {
  const iso = git(['log', '-1', '--format=%cI', '--', ...files])
  if (!iso) throw new Error(`lastmod: no commit found for ${files.join(', ')}`)
  return iso.slice(0, 10)
}
