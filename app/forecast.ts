export function normalizeForecast(_forecast) {
  let forecast = {};
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

export function lowerCaseObjectKeys(obj) {
  let newObj = {};
  Object.entries(obj).forEach(([key, value]) => {
    newObj[key.toLowerCase()] = value;
  });
  return newObj;
}

function formatDescription(pollen) {
  const distribution = {};

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

function toSlug(string) {
  return string.replace(/ø|Ø/g, "o").replace(/\s/g, "-").toLowerCase();
}

function capitalize(s) {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function arrayToSentence(arr) {
  if (arr.length === 1) {
    return arr[0];
  }
  return `${arr.slice(0, arr.length - 1).join(", ")} og ${arr.slice(-1)}`;
}
