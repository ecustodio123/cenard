import assert from 'node:assert/strict'
import { readdir, readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { pages as visiblePages, previewPages } from '../src/data/site.ts'
import { legacyRedirects, productionIndexable } from '../src/data/seo-config.ts'

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
assert.equal(pages.length, visiblePages.length + previewPages.length, 'All institutional and design routes must be prerendered')
const titles = new Set(), descriptions = new Set(), pageContents = new Set()
for (const path of pages) {
  const html = await readFile(path, 'utf8')
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `Single H1: ${path}`)
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1]
  const description = html.match(/<meta\b(?=[^>]*\bname="description")(?=[^>]*\bcontent="([^"]+)")[^>]*>/)?.[1]
  assert.ok(title && description, `Metadata: ${path}`)
  assert.equal((html.match(/<meta\b(?=[^>]*\bname="robots")[^>]*>/g) || []).length, 1, `One robots directive: ${path}`)
  titles.add(title); descriptions.add(description)
  pageContents.add(html.match(/<body>([\s\S]*?)<\/body>/)?.[1])
  for (const match of html.matchAll(/href="(\/web\/[^"?&#]*)(?:[?&#][^"]*)?"/g)) {
    assert.ok((await stat(join('dist', match[1], 'index.html'))).isFile(), `Route destination ${match[1]} from ${path}`)
  }
}
assert.equal(pageContents.size, pages.length, 'Each route retains its own rendered content')
assert.equal(titles.size, pages.length, 'Unique titles per route')
assert.equal(descriptions.size, pages.length, 'Unique descriptions per route')
console.log(`Verified ${pages.length} static pages: content, unique metadata, robots directives and internal route destinations.`)

const origin = 'https://cenardarbitraje.com'
const canonicalUrls = new Set()
for (const path of pages) {
  const html = await readFile(path, 'utf8')
  const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)]
  assert.equal(canonicals.length, 1, `One canonical per page: ${path}`)
  const canonical = new URL(canonicals[0][1])
  assert.equal(canonical.origin, origin, `Official canonical origin: ${path}`)
  assert.equal(canonical.search + canonical.hash, '', `Clean canonical: ${path}`)
  assert.ok(canonical.pathname.endsWith('/'), `Canonical trailing slash: ${path}`)
  canonicalUrls.add(canonical.href)
  for (const property of ['og:title', 'og:description', 'og:url', 'og:image', 'og:locale']) {
    assert.equal([...html.matchAll(new RegExp(`<meta property="${property}" content="([^"]+)"`, 'g'))].length, 1, `Social property ${property}: ${path}`)
  }
  assert.ok(html.includes(`property="og:url" content="${canonical.href}"`), `Social/canonical agreement: ${path}`)
  assert.ok(html.includes('name="twitter:card" content="summary_large_image"'), `Sharing card: ${path}`)
  const scripts = [...html.matchAll(/<script id="cenard-structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  assert.equal(scripts.length, 1, `One structured data graph: ${path}`)
  const graph = JSON.parse(scripts[0][1])
  assert.equal(graph['@context'], 'https://schema.org')
  assert.ok(graph['@graph'].some(node => node['@type'] === 'Organization'))
  assert.ok(graph['@graph'].some(node => node['@type'] === 'WebSite'))
  assert.ok(graph['@graph'].some(node => node.url === canonical.href && ['WebPage', 'AboutPage', 'ContactPage'].includes(node['@type'])))
}
assert.equal(canonicalUrls.size, pages.length, 'Unique canonical per rendered page')
const sitemap = await readFile('dist/sitemap.xml', 'utf8')
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1])
const publicCanonicals = new Set(visiblePages.map(page => `${origin}/web/${page.slug ? `${page.slug}/` : ''}`))
assert.deepEqual(new Set(locations), publicCanonicals, 'Sitemap contains exactly the public canonical pages')
assert.equal(locations.length, publicCanonicals.size, 'No duplicate sitemap entries')
const notFound = await readFile('dist/404.html', 'utf8')
assert.ok(notFound.includes('name="robots" content="noindex,follow"'), '404 excluded from indexing')
assert.ok(!notFound.includes('rel="canonical"'), '404 does not canonicalize to an existing page')
assert.ok(!notFound.includes('id="cenard-structured-data"'), '404 has no institutional page graph')
console.log('Verified canonical URLs, social metadata, JSON-LD, sitemap consistency and 404 exclusion.')

const redirects = await readFile('dist/_redirects', 'utf8')
for (const [from, to] of legacyRedirects) {
  assert.ok(redirects.includes(`${from} ${to} 301`), `Legacy redirect: ${from}`)
  const [path, fragment] = to.split('#')
  const html = await readFile(join('dist', path, 'index.html'), 'utf8')
  if (fragment) assert.ok(html.includes(`id="${fragment}"`), `Redirect section exists: ${to}`)
}
assert.equal(productionIndexable({}), true)
assert.equal(productionIndexable({ SITE_INDEXABLE: 'false' }), false)
assert.equal(productionIndexable({ CF_PAGES_BRANCH: 'preview', SITE_INDEXABLE: 'true' }), false)
assert.equal(productionIndexable({ CF_PAGES_BRANCH: 'main' }), true)
assert.equal(productionIndexable({ CF_PAGES_BRANCH: 'release', PRODUCTION_BRANCH: 'release' }), true)
assert.throws(() => productionIndexable({ SITE_INDEXABLE: 'yes' }))
console.log('Verified legacy redirect destinations and environment indexing controls.')

const home = await readFile('dist/web/index.html', 'utf8')
const indexable = home.includes('name="robots" content="index,follow,max-image-preview:large"')
const robots = await readFile('dist/robots.txt', 'utf8')
const headers = await readFile('dist/_headers', 'utf8')
if (indexable) {
  assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`))
  assert.ok(!robots.includes('Disallow: /'))
  assert.ok(!headers.startsWith('/*'))
} else {
  assert.ok(robots.includes('Disallow: /'))
  assert.ok(headers.includes('/*\n  X-Robots-Tag: noindex, nofollow'))
  for (const path of pages) assert.ok((await readFile(path, 'utf8')).includes('name="robots" content="noindex,follow"'))
}
console.log(`Verified robots.txt and HTTP indexing headers for ${indexable ? 'production' : 'preview'}.`)

for (const page of previewPages) {
  const html = await readFile(join('dist', 'web', page.slug, 'index.html'), 'utf8')
  assert.ok(html.includes('name="robots" content="noindex,follow"'), `Design preview excluded from indexing: ${page.slug}`)
  assert.ok(!locations.includes(`${origin}/web/${page.slug}/`), `Design preview excluded from sitemap: ${page.slug}`)
  if (page.slug === 'calculadora') {
    assert.ok(html.includes('Calculadora de costos'), 'Calculator renders its own page')
    assert.match(html, /<button[^>]*type="submit"[^>]*>Calcular costos<\/button>/, 'Local calculator form is available')
    assert.ok(html.includes('Borrador de estimación local'), 'Calculator retains its draft status')
    assert.ok(!html.includes('Este camino no lleva'), 'Calculator does not render the 404 page')
  }
}
console.log(`Verified ${previewPages.length} design previews: rendered HTML, noindex and sitemap exclusion.`)
