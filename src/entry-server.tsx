import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./App";
import { pages, pathFor } from "./data/site";

export const routes = pages.map((page) => ({
  ...page,
  path: pathFor(page.slug),
}));
export function render(url: string) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );
}
