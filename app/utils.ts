const rtf = new Intl.RelativeTimeFormat("no", {
  numeric: "auto",
});

function relativeTimeString(date: Date) {
  let today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);

  const diff = date.getTime() - today.getTime();
  const days = diff / 86400000;
  const string = rtf.format(days, "day");
  return capitalize(string);
}

type lowerCaseKeys<Obj> = {
  [K in keyof Obj as Lowercase<Extract<K, string>>]: Obj[K];
};

function objectKeysToLowerCase<O extends Record<string, any>>(
  obj: O
): lowerCaseKeys<O> {
  let newObj: Record<Lowercase<string>, any> = {};
  Object.entries(obj).forEach(([key, value]) => {
    newObj[key.toLowerCase()] = value;
  });
  return newObj as lowerCaseKeys<O>;
}

function capitalize(s: string) {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function slugify(string: string) {
  return string.replace(/ø|Ø/g, "o").replace(/\s/g, "-").toLowerCase();
}

function arrayToSentence(arr: string[]) {
  // @ts-ignore
  const formatter = new Intl.ListFormat("no");
  return formatter.format(arr);
}

export {
  relativeTimeString,
  objectKeysToLowerCase,
  capitalize,
  slugify,
  arrayToSentence,
};
