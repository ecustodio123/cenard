import assert from 'node:assert/strict'
import { readdir, readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { pages as visiblePages } from '../src/data/site.ts'

async function files(directory) {
  const output = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) output.push(...await files(path))
    else if (entry.name === 'index.html') output.push(path)
  }
  return output
}
const pages = await files('dist/web')
assert.equal(pages.length, visiblePages.length, 'All institutional routes must be prerendered')
const titles = new Set(), descriptions = new Set()
for (const path of pages) {
  const html = await readFile(path, 'utf8')
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `Single H1: ${path}`)
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1]
  const description = html.match(/<meta\b(?=[^>]*\bname="description")(?=[^>]*\bcontent="([^"]+)")[^>]*>/)?.[1]
  assert.ok(title && description, `Metadata: ${path}`)
  assert.equal((html.match(/<meta\b(?=[^>]*\bname="robots")[^>]*>/g) || []).length, 1, `One robots directive: ${path}`)
  titles.add(title); descriptions.add(description)
  for (const match of html.matchAll(/href="(\/web\/[^"?&#]*)(?:[?&#][^"]*)?"/g)) {
    // JPRD explicitly retains this literal destination while its page is disabled.
    // Do not create a route or enable the calculator merely to satisfy link checks.
    if (path === join('dist', 'web', 'jprd', 'index.html') && match[1] === '/web/calculadora') {
      console.warn('JPRD: requested href /web/calculadora is retained; destination is not enabled.')
      continue
    }
    assert.ok((await stat(join('dist', match[1], 'index.html'))).isFile(), `Route destination ${match[1]} from ${path}`)
  }
}
assert.equal(titles.size, visiblePages.length, 'Unique titles per route')
assert.equal(descriptions.size, visiblePages.length, 'Unique descriptions per route')
console.log(`Verified ${visiblePages.length} static pages: content, unique metadata, robots directives and internal route destinations.`)
