import {
  format,
  startOfMonth,
  startOfISOWeek,
  add,
  set,
  getMonth as dateFnsGetMonth,
  isToday as dateFnsIsToday,
  getYear,
  getDate,
  getHours
} from "date-fns";
import { fr } from "date-fns/locale";

const NB_DAY_PER_WEEK = 7;
const NB_WEEK_PER_MONTH = 5;

/**
 * format month name in french
 * default pattern is "MMMM"
 * @param month
 * @param pattern
 */
export const getMonthName = (month = new Date(), pattern = "MMMM") => {
  return format(month, pattern, { locale: fr });
};

/**
 * format day name in french
 * @param day
 */
export const getDayName = (day: Date) => {
  return format(day, "EEEE", { locale: fr });
};

/**
 * format day name
 * @param day
 * @param pattern
 */
export const formatDate = (day: Date, pattern = "dd") => {
  return format(day, pattern);
};

/**
 * check if param day is in param month
 * @param day
 * @param month
 */
export const isInMonth = (day: Date, month: number) => {
  return getMonth(day) === month;
};

/**
 * get month number [1-12]
 * @param date
 */
export const getMonth = (date: Date) => {
  return dateFnsGetMonth(date) + 1;
};

/**
 * check if date is current day
 * @param day
 */
export const isToday = (day: Date) => {
  return dateFnsIsToday(day);
};

/**
 * increment date from one month
 * @param month
 */
export const incrementMonth = (month: Date) => {
  return add(month, { months: 1 });
};

/**
 * decrement date from one month
 * @param month
 */
export const decrementMonth = (month: Date) => {
  return add(month, { months: -1 });
};

/**
 * return new date set to current date month year day hour
 * and 0 for other fields
 * @param date
 * @param offset
 */
export const setCurrentHour = (date: Date, offset: number = 0) => {
  return set(new Date(), {
    month: dateFnsGetMonth(date),
    year: getYear(date),
    milliseconds: 0,
    seconds: 0,
    date: getDate(date),
    hours: getHours(new Date()) + offset,
    minutes: 0
  });
};

/**
 * add offset hour to date param
 * @param date
 * @param offset
 */
export const addHours = (date: Date, offset: number) => {
  return add(new Date(date), { hours: offset });
};

/**
 * return the week day [0-6] for given month
 * @param month
 */
export const getFirstDayOfMonth = (month: Date) => {
  return startOfMonth(month);
};

/**
 * get first day of week
 * @param date
 */
export const getFirstDayOfWeek = (date: Date) => {
  return startOfISOWeek(date);
};

/**
 * get array of week to display for given month
 * week is an array of days
 * return will be Date[][]
 * first we get first day of month
 * then we get first day of week of this day
 * then we iterate to create an array of array of seven days
 * @param month
 */
export const getDatesToDisplay = (month: Date): Date[][] => {
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
