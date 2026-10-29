import { createServer, loadEnv } from "vite";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { officialOrigin, productionIndexable, legacyRedirects } from "../src/data/seo-config.ts";

// Normalize an existing output as well, so repeating prerender never duplicates metadata
// or reuses the previously rendered homepage as another route's content.
const template = (await readFile("dist/index.html", "utf8"))
  .replace(/<meta\b(?=[^>]*\bname="(?:robots|description|twitter:[^"]+)")[^>]*>/gi, "")
  .replace(/<meta\b(?=[^>]*\bproperty="og:[^"]+")[^>]*>/gi, "")
  .replace(/<link\b(?=[^>]*\brel="canonical")[^>]*>/gi, "")
  .replace(/<script id="cenard-structured-data"[^>]*>[\s\S]*?<\/script>/g, "")
  .replace(/<div id="root">[\s\S]*<\/div>(?=\s*<\/body>)/, '<div id="root"></div>');
const server = await createServer({ mode: "production", server: { middlewareMode: true }, appType: "custom" });
const escape = (value) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
try {
  const { routes, render } = await server.ssrLoadModule("/src/entry-server.tsx");
  const { getPageSeo } = await server.ssrLoadModule("/src/lib/seo.ts");
  const indexable = productionIndexable({ ...loadEnv("production", process.cwd(), ""), ...process.env });
  for (const route of [...routes, { path: "/" }, { path: "/404.html" }]) {
    const seo = getPageSeo(route.path, indexable);
    const meta = Object.entries(seo.meta).map(([key, value]) =>
      `<meta ${key.startsWith("og:") ? "property" : "name"}="${escape(key)}" content="${escape(value)}" />`
    ).join("\n");
    const canonical = seo.canonical ? `<link rel="canonical" href="${escape(seo.canonical)}" />` : "";
    const structuredData = seo.structuredData
      ? `<script id="cenard-structured-data" type="application/ld+json">${JSON.stringify(seo.structuredData).replace(/</g, "\\u003c")}</script>` : "";
    const html = template
      .replace(/<title>.*?<\/title>/, `<title>${escape(seo.title)}</title>`)
      .replace("</head>", `${meta}\n${canonical}\n${structuredData}\n</head>`)
      .replace('<div id="root"></div>', `<div id="root">${render(route.path)}</div>`);
    const target = route.path === "/404.html" ? resolve("dist/404.html") : resolve("dist", "." + route.path, "index.html");
    await mkdir(resolve(target, ".."), { recursive: true });
    await writeFile(target, html);
  }
  await writeFile("dist/robots.txt", indexable
    ? `User-agent: *\nAllow: /\nSitemap: ${officialOrigin}/sitemap.xml\n`
    : "User-agent: *\nDisallow: /\n");
  await writeFile("dist/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((r) => `  <url><loc>${escape(new URL(r.path, officialOrigin).href)}</loc></url>`).join("\n")}\n</urlset>\n`);
  await writeFile("dist/_headers", indexable
    ? "/404.html\n  X-Robots-Tag: noindex, follow\n"
    : "/*\n  X-Robots-Tag: noindex, nofollow\n");
  // Keep the existing /web/ paths and consolidate the duplicate root homepage.
  const redirects = [
    "/ /web/ 301",
    ...routes.map((r) => `${r.path.slice(0, -1)} ${r.path} 301`),
    ...legacyRedirects.flatMap(([from, to]) => [`${from} ${to} 301`, `${from.slice(0, -1)} ${to} 301`]),
  ];
  await writeFile("dist/_redirects", redirects.join("\n") + "\n");
  console.log(`Prerendered ${routes.length} institutional routes, root alias and 404. Canonical origin: ${officialOrigin}. Indexable: ${indexable}.`);
} finally {
  await server.close();
}
