import React from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';
import { Helmet } from 'react-helmet';

import fontRegular from '../../fonts/Rubik-Regular-subset.woff2';
import fontMedium from '../../fonts/Rubik-Medium-subset.woff2';
import styles from './styles.module.css';

function Layout(props) {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `);

  const siteMetadata = site.siteMetadata;
  const title = props.title || siteMetadata.title;

  return (
    <>
      <Helmet
        defaultTitle={siteMetadata.title}
        titleTemplate={`%s - ${siteMetadata.title}`}
      >
        <html lang="nb-no" />
        <meta property="og:site_name" content={siteMetadata.title} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={siteMetadata.description} />
        <meta name="description" content={siteMetadata.description} />
        <link
          rel="preload"
          href={fontRegular}
          as="font"
          type="font/woff2"
          crossorigin="anonymous"
        />
        <link
          rel="preload"
          href={fontMedium}
          as="font"
          type="font/woff2"
          crossorigin="anonymous"
        />
      </Helmet>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.title}>{title}</h1>
          {props.title ? (
            <Link className={styles.back} to="/">
              Tilbake
            </Link>
          ) : null}
        </div>
      </header>
      <main className={styles.wrap}>{props.children}</main>
      <footer className={styles.footer}>
        <details>
          <summary>Kreditering</summary>
          <ul>
            <li>
              Pollendata fra{' '}
              <a href="http://naaf.no" rel="noopener">
                Norges Astma- og Allergiforbund
              </a>
              .
            </li>
            <li>
              Bie-ikon av{' '}
              <a href="https://thenounproject.com/maxim221/">Maxim Kulikov</a>{' '}
              fra the Noun Project
            </li>
          </ul>
        </details>
      </footer>
    </>
  );
}

export default Layout;
