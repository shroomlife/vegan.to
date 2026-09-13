/**
 * IndexNow: tell Bing, Yandex, Seznam, Naver and friends which URLs changed,
 * right after a deploy. Google does not take part, it reads the sitemap.
 *
 * The key is public by design: the engines fetch https://vegan.to/<key>.txt
 * to confirm the site owns the submission. Run with: bun run indexnow
 */
import { readFileSync } from 'node:fs'
import { routePaths } from '../src/data/routes'

const HOST = 'vegan.to'
const key = readFileSync('public/indexnow-key.txt', 'utf-8').trim()

const body = {
  host: HOST,
  key,
  keyLocation: `https://${HOST}/indexnow-key.txt`,
  urlList: routePaths.map((path) => `https://${HOST}${path}`),
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
})

console.log(`IndexNow: ${response.status} ${response.statusText} for ${body.urlList.length} urls`)
if (!response.ok) {
  console.error(await response.text())
  process.exit(1)
}
