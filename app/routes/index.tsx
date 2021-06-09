import type { LoaderFunction } from 'remix';
import { useRouteData } from 'remix';
import { Link } from 'react-router-dom';
import parser from 'fast-xml-parser';

import { lowerCaseObjectKeys, normalizeForecast } from '../forecast';

export let loader: LoaderFunction = async () => {
  const resp = await fetch(
    `http://xml.pollenvarslingen.no/pollenvarsel.asmx/GetAllRegions?userKey=${process.env.POLLENVARSEL_API_KEY}`
  );
  const xml = await resp.text();
  const data = parser.parse(xml).RegionForecast.Days.RegionDay;

  return normalizeForecast(
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
};

function Index() {
  let data = useRouteData<
    {
      id: number;
      name: string;
      forecast: {
        date: string;
        distribution: number;
        description: string;
        pollen: string[];
      }[];
      slug: string;
    }[]
  >();

  return (
    <section className="section">
      <h2 className="heading">Andre steder</h2>

      <ul className="list content">
        {data.map((region) => {
          return (
            <li key={region.id} className="list-item">
              <Link to={region.slug}>{region.name}</Link>
              <p className="description">{region.forecast[0].description}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default Index;
