import {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  usePendingLocation,
} from 'remix';
import { Meta, Links, Scripts, LiveReload } from 'remix';
import { Outlet, Link, useLocation } from 'react-router-dom';

import stylesUrl from './styles/global.css';

import { name, description } from '../package.json';

export let links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

export let loader: LoaderFunction = async () => {
  return { date: new Date() };
};

export let meta: MetaFunction = () => ({
  title: name,
  description,
  'og:description': description,
  'og:title': name,
  'og:site_name': name,
});

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}

        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();
  const root = location.pathname === '/';

  return (
    <Document>
      <header className="header content section">
        <div className="header-inner wrap">
          <h1 className="title">Pollenvarsel</h1>
          {!root ? (
            <Link className="back" to="/">
              Tilbake
            </Link>
          ) : null}
        </div>
      </header>

      <main className="wrap">
        <Outlet />
      </main>

      <footer className="footer section">
        <p>
          Pollendata fra{' '}
          <a href="http://naaf.no" rel="noopener">
            Norges Astma- og Allergiforbund
          </a>
          .
        </p>
      </footer>
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
