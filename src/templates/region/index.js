import React from 'react';
import { Helmet } from 'react-helmet';
import { graphql } from 'gatsby';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs';

import { dayInWords } from './utils';

import Layout from '../../components/layout';
import Distribution from '../../components/distribution';

import styles from './styles.module.css';

function Region(props) {
  const region = props.data.region;

  return (
    <>
      <Helmet title={region.name} />
      <Layout title={region.name}>
        <Tabs className={styles.root}>
          <TabList className={styles.tabs}>
            {region.forecast.map(forecast => {
              return (
                <Tab key={`tab-${forecast.date}`} className={styles.tab}>
                  {dayInWords(forecast.date)}
                </Tab>
              );
            })}
          </TabList>

          <TabPanels>
            {region.forecast.map(forecast => {
              return (
                <TabPanel key={`panel-${forecast.date}`}>
                  <p className={styles.description}>{forecast.description}</p>

                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.heading}>Type</th>
                        <th className={styles.heading}>Spredning</th>
                      </tr>
                    </thead>
                    <tbody>
                      {forecast.pollen.map(pollen => {
                        return (
                          <tr key={pollen.id} className={styles.tableRow}>
                            <td className={styles.tableCell}>{pollen.name}</td>
                            <td className={styles.distribution}>
                              <Distribution dist={pollen.distribution} />
                              {pollen.description}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </TabPanel>
              );
            })}
          </TabPanels>
        </Tabs>
      </Layout>
    </>
  );
}

export const query = graphql`
  query($slug: String!) {
    region: pollenvarsel(slug: { eq: $slug }) {
      name
      slug
      forecast {
        date
        distribution
        description
        pollen {
          id
          name
          distribution
          description
        }
      }
    }
  }
`;

export default Region;
