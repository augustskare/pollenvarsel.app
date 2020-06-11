const MILLISECONDS_IN_DAY = 86400000;
function dayInWords(d) {
  const diff = Math.round((new Date(d) - new Date()) / MILLISECONDS_IN_DAY);

  switch (diff) {
    case -2: {
      return 'I går';
    }
    case -1: {
      return 'I dag';
    }
    case 0: {
      return 'I morgen';
    }

    default: {
      return diff;
    }
  }
}

export { dayInWords };
