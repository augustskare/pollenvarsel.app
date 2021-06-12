import parser from "fast-xml-parser";

import { relativeTimeString } from "./utils";
import { objectKeysToLowerCase, normalizeForecast } from "./forecast";

const BASE_URL = "http://xml.pollenvarslingen.no/pollenvarsel.asmx";

export async function get(slug?: string) {
  const resp = await fetch(
    `${BASE_URL}/GetAllRegions?userKey=${process.env.POLLENVARSEL_API_KEY}`
  );
  const xml = await resp.text();
  const data = parser.parse(xml).RegionForecast.Days.RegionDay;

  const result = normalizeForecast(
    data.map((day) => {
      return {
        date: relativeTimeString(new Date(day.Date)),
        regions: day.Regions.Region.map((region) => {
          return {
            ...objectKeysToLowerCase(region),
            pollen: region.PollenTypes.Pollen.map(objectKeysToLowerCase),
          };
        }),
      };
    })
  );

  if (slug !== undefined) {
    return result.find((f) => f.slug === slug);
  }

  return result;
}
