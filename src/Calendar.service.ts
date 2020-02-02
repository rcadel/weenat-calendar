import { format, startOfMonth, startOfISOWeek, add } from "date-fns";
import { fr } from "date-fns/locale";

const NB_DAY_PER_WEEK = 7;
const NB_WEEK_PER_MONTH = 5;

export const getCurrentMonthName = (pattern = "MMMM") => {
  return format(new Date(), pattern, { locale: fr });
};

export const getDayName = (day: Date) => {
  return format(day, "EEEE", { locale: fr });
};

export const formatDate = (day: Date, pattern = "dd") => {
  return format(day, pattern);
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

export const getDatesToDisplay = (month?: number, year?: number) => {
  const weeks = Array(NB_WEEK_PER_MONTH)
    .fill(0)
    .map(week => {
      return Array(NB_DAY_PER_WEEK).fill(0);
    });

  const firstDayOfWeekToDisplay = getFirstDayOfWeek(
    getFirstDayOfMonth(new Date())
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
