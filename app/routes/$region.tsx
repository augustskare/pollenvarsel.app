import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs';
import type { LinksFunction, LoaderFunction } from 'remix';
import { useRouteData } from 'remix';
import parser from 'fast-xml-parser';

import { normalizeForecast, lowerCaseObjectKeys } from '../forecast';
import { Distribution } from '../components/distribution';
import styles from '../styles/region.css';

export let links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

export let loader: LoaderFunction = async ({ params }) => {
  const resp = await fetch(
    `http://xml.pollenvarslingen.no/pollenvarsel.asmx/GetAllRegions?userKey=${process.env.POLLENVARSEL_API_KEY}`
  );
  const xml = await resp.text();
  const data = parser.parse(xml).RegionForecast.Days.RegionDay;

  const forecast = normalizeForecast(
    data.map((day) => {
      return {
        date: day.Date,
        regions: day.Regions.Region.map((region) => {
          return {
            ...lowerCaseObjectKeys(region),
            pollen: region.PollenTypes.Pollen.map(lowerCaseObjectKeys),
          };
        }),
      };
    })
  );

  return forecast.find((f) => f.slug === params.region);
};

function Region() {
  const region = useRouteData<Region>();

  return (
    <>
      <Tabs className="content section">
        <TabList className="tabs">
          {region.forecast.map((forecast) => {
            return (
              <Tab key={`tab-${forecast.date}`} className="tab">
                {forecast.date}
              </Tab>
            );
          })}
        </TabList>

        <TabPanels>
          {region.forecast.map((forecast) => {
            return (
              <TabPanel key={`panel-${forecast.date}`}>
                <p className="description">{forecast.description}</p>

                <table className="table">
                  <thead>
                    <tr>
                      <th className="heading table-cell">Type</th>
                      <th className="heading table-cell">Spredning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forecast.pollen.map((pollen) => {
                      return (
                        <tr key={pollen.id} className="table-row">
                          <td className="table-cell">{pollen.name}</td>
                          <td className="distribution table-cell">
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
    </>
  );
}

export default Region;
