import { createServer } from "vite";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const template = (await readFile("dist/index.html", "utf8")).replace(
  /<meta name="robots" content="[^"]*"\s*\/>/,
  "",
);
const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});
const escape = (value) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
try {
  const { routes, render } = await server.ssrLoadModule(
    "/src/entry-server.tsx",
  );
  const siteUrl = process.env.SITE_URL ? new URL(process.env.SITE_URL) : null;
  if (siteUrl && !["http:", "https:"].includes(siteUrl.protocol))
    throw new Error("SITE_URL must use http or https");
  const indexable = !!siteUrl && process.env.SITE_INDEXABLE === "true";
  for (const route of [
    ...routes,
    { path: "/", title: "Inicio", description: routes[0].description },
    {
      path: "/404.html",
      title: "Página no encontrada",
      description: "Esta página no existe en el sitio de CENARD.",
    },
  ]) {
    const title =
      route.title === "Inicio"
        ? "Centro Nacional para la Resolución de Disputas | CENARD"
        : `${route.title} | CENARD`;
    const canonical =
      siteUrl && route.path !== "/404.html"
        ? new URL(route.path === "/" ? "/web/" : route.path, siteUrl).href
        : "";
    const meta = `<meta name="robots" content="${indexable && route.path !== "/404.html" ? "index,follow" : "noindex,nofollow"}" />\n<meta property="og:title" content="${escape(title)}" />\n<meta property="og:description" content="${escape(route.description)}" />\n<meta property="og:type" content="website" />\n${canonical ? `<link rel="canonical" href="${escape(canonical)}" />\n<meta property="og:url" content="${escape(canonical)}" />` : ""}`;
    const html = template
      .replace(/<title>.*?<\/title>/, `<title>${escape(title)}</title>`)
      .replace(
        /<meta\b(?=[^>]*\bname="description")[^>]*>/i,
        `<meta name="description" content="${escape(route.description)}" />`,
      )
      .replace("</head>", `${meta}\n</head>`)
      .replace(
        '<div id="root"></div>',
        `<div id="root">${render(route.path)}</div>`,
      );
    const target =
      route.path === "/404.html"
        ? resolve("dist/404.html")
        : resolve("dist", "." + route.path, "index.html");
    await mkdir(resolve(target, ".."), { recursive: true });
    await writeFile(target, html);
  }
  await writeFile(
    "dist/robots.txt",
    indexable
      ? `User-agent: *\nAllow: /\nSitemap: ${new URL("/sitemap.xml", siteUrl).href}\n`
      : "User-agent: *\nDisallow: /\n",
  );
  if (siteUrl)
    await writeFile(
      "dist/sitemap.xml",
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((r) => `<url><loc>${escape(new URL(r.path, siteUrl).href)}</loc></url>`).join("")}</urlset>`,
    );
  await writeFile(
    "dist/_headers",
    indexable ? "" : "/*\n  X-Robots-Tag: noindex, nofollow\n",
  );
  console.log(
    `Prerendered ${routes.length} institutional routes, root alias and 404. Indexable: ${indexable}.`,
  );
} finally {
  await server.close();
}
