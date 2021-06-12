export function normalizeForecast(_forecast: RawRegion[]) {
  let forecast: Record<number, Region> = {};
  _forecast.forEach((day) => {
    day.regions.forEach(({ name, id, ...region }) => {
      forecast[id] = forecast[id] || {
        id,
        name,
        forecast: [],
        slug: toSlug(name),
      };

      forecast[id].forecast.push({
        date: day.date,
        distribution: region.distribution,
        description: formatDescription(region.pollen),
        pollen: region.pollen.map(({ description, ...pollen }) => {
          return {
            ...pollen,
            description: description.replace(" spredning", ""),
          };
        }),
      });
    });
  });

  return Object.entries(forecast).map(([_, f]) => f);
}

export function objectKeysToLowerCase(obj: Record<string, any>) {
  let newObj: Record<string, any> = {};
  Object.entries(obj).forEach(([key, value]) => {
    newObj[key.toLowerCase()] = value;
  });
  return newObj;
}

function formatDescription(pollen: Pollen[]) {
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

function toSlug(string: string) {
  return string.replace(/ø|Ø/g, "o").replace(/\s/g, "-").toLowerCase();
}

function capitalize(s: string) {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function arrayToSentence(arr: string[]) {
  // @ts-ignore
  const formatter = new Intl.ListFormat("no");
  return formatter.format(arr);
}
