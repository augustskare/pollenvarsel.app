import type { LinksFunction, LoaderFunction, MetaFunction } from "remix";

import { Meta, Links, Scripts, LiveReload, useMatches } from "remix";
import { Outlet } from "react-router-dom";

import stylesUrl from "./styles/global.css";

import { name, description } from "../package.json";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export let loader: LoaderFunction = async () => {
  return { date: new Date() };
};

export let meta: MetaFunction = () => ({
  title: name,
  description,
  "og:description": description,
  "og:title": name,
  "og:site_name": name,
});

function Document({ children }: { children: React.ReactNode }) {
  const matches = useMatches();
  const hydrate = matches.some((match) => match.handle?.hydrate);

  return (
    <html lang="nb-NO">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}

        {hydrate && <Scripts />}
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document>
      <h1>App Error</h1>
      <pre>{error.message}</pre>
      <p>
        Replace this UI with what you want users to see when your app throws
        uncaught errors.
      </p>
    </Document>
  );
}
