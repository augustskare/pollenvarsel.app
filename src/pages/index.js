import React from 'react';
import { Link, graphql } from 'gatsby';

import Layout from '../components/layout';
import Distribution from '../components/distribution';

import styles from './index.module.css';

function Index(props) {
  const { regions, featured } = props.data;

  return (
    <Layout>
      <section className={styles.section}>
        <h2 className={styles.heading}>Din plassering</h2>

        <div className={styles.featured}>
          <div className={styles.featuredInner}>
            <p className={styles.title}>{featured.name}</p>

            <dl className={styles.forcast}>
              {featured.forecast[0].pollen.map(pollen => {
                return (
                  <div key={pollen.id} className={styles.forcastItem}>
                    <Distribution large dist={pollen.distribution} />
                    <div>
                      <dt className={styles.forcastName}>{pollen.name}</dt>
                      <dd className={styles.forcastDesc}>
                        {pollen.description}
                      </dd>
                    </div>
                  </div>
                );
              })}
            </dl>
          </div>

          <Link className={styles.link} to={`/${featured.slug}`}>
            Fullstendig varsel for {featured.name}
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Andre steder</h2>

        <ul className={styles.list}>
          {regions.edges.map(({ node: region }) => {
            return (
              <li key={region.id} className={styles.listItem}>
                <Link to={`/${region.slug}`}>{region.name}</Link>
                <p className={styles.description}>
                  {region.forecast[0].description}
                </p>
              </li>
            );
          })}
        </ul>
      </section>
    </Layout>
  );
}

export const query = graphql`
  query {
    featured: pollenvarsel(slug: { eq: "troms" }) {
      name
      slug
      forecast {
        pollen {
          id
          name
          distribution
          description
        }
      }
    }
    regions: allPollenvarsel(filter: { slug: { nin: "troms" } }) {
      edges {
        node {
          id
          name
          slug
          forecast {
            description
          }
        }
      }
    }
  }
`;

export default Index;
