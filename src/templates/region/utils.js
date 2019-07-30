import { differenceInCalendarDays } from 'date-fns';

function dayInWords(d) {
  const today = new Date();
  const diff = differenceInCalendarDays(today, new Date(d));

  switch (diff) {
    case 1: {
      return 'I går';
    }
    case 0: {
      return 'I dag';
    }
    case -1: {
      return 'I morgen';
    }
    default: {
      return diff;
    }
  }
}

export { dayInWords };
