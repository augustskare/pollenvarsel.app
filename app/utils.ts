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

  return string.charAt(0).toUpperCase() + string.slice(1);
}

export { relativeTimeString };
