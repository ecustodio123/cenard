import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./App";
import { pages, previewPages, pathFor } from "./data/site";

export const routes = pages.map((page) => ({
  ...page,
  path: pathFor(page.slug),
}));
export const previewRoutes = previewPages.map(page => ({ ...page, path: pathFor(page.slug) }));
export const standaloneRoutes = [{ path: "/admin" }];
export function render(url: string) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );
}
