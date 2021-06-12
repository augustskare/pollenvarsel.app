import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

function Layout(props: { title?: string; children: ReactNode }) {
  return (
    <>
      <header className="header content section">
        <div className="header-inner wrap">
          <h1 className="title">{props.title || 'Pollenvarsel'}</h1>
          {props.title !== undefined ? (
            <Link className="back" to="/">
              Tilbake
            </Link>
          ) : null}
        </div>
      </header>

      <main className="wrap">{props.children}</main>

      <footer className="footer section">
        <p>
          Pollendata fra{' '}
          <a href="http://naaf.no" rel="noopener">
            Norges Astma- og Allergiforbund
          </a>
          .
        </p>
      </footer>
    </>
  );
}

export { Layout };
