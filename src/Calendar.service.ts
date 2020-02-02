import {
  format,
  startOfMonth,
  startOfISOWeek,
  add,
  set,
  getMonth as dateFnsGetMonth,
  isToday as dateFnsIsToday,
  getYear
} from "date-fns";
import { fr } from "date-fns/locale";

const NB_DAY_PER_WEEK = 7;
const NB_WEEK_PER_MONTH = 5;

export const getMonthName = (month = new Date(), pattern = "MMMM") => {
  return format(month, pattern, { locale: fr });
};

export const getDayName = (day: Date) => {
  return format(day, "EEEE", { locale: fr });
};

export const formatDate = (day: Date, pattern = "dd") => {
  return format(day, pattern);
};

export const isInMonth = (day: Date, month: number) => {
  return getMonth(day) === month;
};

export const getMonth = (date: Date) => {
  return dateFnsGetMonth(date) + 1;
};

export const isToday = (day: Date) => {
  return dateFnsIsToday(day);
};

export const incrementMonth = (month: Date) => {
  return add(month, { months: 1 });
};

export const decrementMonth = (month: Date) => {
  return add(month, { months: -1 });
};

/**
 * return the week day [0-6] for given month
 * @param month
 */
export const getFirstDayOfMonth = (month: Date) => {
  return startOfMonth(month);
};

export const getFirstDayOfWeek = (date: Date) => {
  return startOfISOWeek(date);
};

export const getDatesToDisplay = (month: Date) => {
  const weeks = Array(NB_WEEK_PER_MONTH)
    .fill(0)
    .map(() => {
      return Array(NB_DAY_PER_WEEK).fill(0);
    });
  const monthToDisplay = set(new Date(), {
    month: getMonth(month),
    year: getYear(month),
    milliseconds: 0,
    seconds: 0,
    date: 0,
    hours: 0,
    minutes: 0
  });
  const firstDayOfWeekToDisplay = getFirstDayOfWeek(
    getFirstDayOfMonth(monthToDisplay)
  );
  let allDates = Array(NB_DAY_PER_WEEK * NB_WEEK_PER_MONTH).fill(new Date());
  let currentDate = firstDayOfWeekToDisplay;
  allDates = allDates.map(() => {
    let result = new Date(currentDate);
    currentDate = add(currentDate, { days: 1 });
    return result;
  });
  let currentWeekIdx = 0;
  let currentDayIdx = 0;
  allDates.forEach(date => {
    weeks[currentWeekIdx][currentDayIdx] = date;
    if (currentDayIdx + 1 === NB_DAY_PER_WEEK) {
      currentWeekIdx++;
      currentDayIdx = 0;
    } else {
      currentDayIdx++;
    }
  });
  return weeks;
};
