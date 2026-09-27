import type { LinksFunction } from "react-router";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import stylesheet from "./tailwind.css?url";

const favicon = "data:image/svg+xml," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#1f2937"/><text x="16" y="23" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" font-weight="bold" fill="white">R</text></svg>',
);

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: favicon },
  { rel: "stylesheet", href: stylesheet },
];

export default function App() {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Projeto de estudo</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
