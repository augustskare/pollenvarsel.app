import parser from "fast-xml-parser";

import {
  arrayToSentence,
  capitalize,
  objectKeysToLowerCase,
  slugify,
  relativeTimeString,
} from "./utils";

export async function forecast(userKey: string) {
  const endpoint = new URL(
    "http://xml.pollenvarslingen.no/pollenvarsel.asmx/GetAllRegions"
  );
  endpoint.searchParams.set("userKey", userKey);

  const resp = await fetch(endpoint.toString());
  const xml = await resp.text();
  const json = parser.parse(xml) as PollenvarselResponse;
  const data = normalizeForecast(json);

  return {
    all: function all() {
      return data;
    },
    index: function index(featured?: number) {
      let regions = data.map((region) => {
        return {
          id: region.id,
          name: region.name,
          slug: region.slug,
          description: region.forecast[0].description,
        };
      });

      if (featured) {
        regions = regions.filter((region) => region.id !== featured);
        return {
          regions,
          featured: data.find((region) => region.id === featured),
        };
      }

      return { regions, featured: undefined };
    },
    region: function region(slug: string) {
      const region = data.find((region) => region.slug === slug);
      if (!region) {
        throw new Error(`${region}, region not found`);
      }
      return region;
    },
    regions: function regions() {
      return data.map(({ name, id }) => ({ id, name }));
    },
  };
}

export function normalizeForecast(forecast: PollenvarselResponse): Region[] {
  let data: Record<number, Region> = {};

  forecast.RegionForecast.Days.RegionDay.forEach((day) => {
    day.Regions.Region.forEach((region) => {
      const id = region.Id;
      const name = region.Name;
      data[id] = data[id] || {
        id,
        name: name,
        forecast: [],
        slug: slugify(name),
      };

      const pollen = region.PollenTypes.Pollen.map(objectKeysToLowerCase);

      data[id].forecast.push({
        date: relativeTimeString(new Date(day.Date)),
        distribution: region.Distribution,
        description: formatDescription(pollen),
        pollen: pollen.map(({ description, ...pollen }) => {
          return {
            ...pollen,
            description: description.replace(" spredning", ""),
          };
        }),
      });
    });
  });

  return Object.values(data);
}

function formatDescription(pollen: Region["forecast"][0]["pollen"]) {
  const distribution: Record<string, string[]> = {};

  pollen
    .filter(({ distribution }) => distribution)
    .forEach(({ description, name }) => {
      (distribution[description] || (distribution[description] = [])).push(
        name
      );
    });

  if (!Object.keys(distribution).length) {
    return "Ingen spredning av pollen.";
  }

  let short_description = arrayToSentence(
    Object.entries(distribution).map(
      ([key, value]) => `${key} fra ${arrayToSentence(value)}`
    )
  );
  return capitalize(short_description.toLowerCase()) + ".";
}
