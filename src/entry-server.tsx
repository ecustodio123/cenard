import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
    <QueryClientProvider client={new QueryClient()}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </QueryClientProvider>,
  );
}
