import {
  addHours,
  decrementMonth,
  incrementMonth,
  setCurrentHour,
  getFirstDayOfMonth,
  getDatesToDisplay
} from "./Calendar.service";

test("test addHours", () => {
  expect(addHours(new Date(0), 1).getHours()).toBe(2);
});

test("test decrementMonth", () => {
  expect(decrementMonth(new Date(0)).getMonth()).toBe(11);
});

test("test incrementMonth", () => {
  expect(incrementMonth(new Date(0)).getMonth()).toBe(1);
});

test("test setCurrentHour", () => {
  expect(setCurrentHour(new Date()).getFullYear()).toBe(
    new Date().getFullYear()
  );
  expect(setCurrentHour(new Date()).getMonth()).toBe(new Date().getMonth());
  expect(setCurrentHour(new Date()).getDay()).toBe(new Date().getDay());
  expect(setCurrentHour(new Date()).getHours()).toBe(new Date().getHours());
  expect(setCurrentHour(new Date()).getMinutes()).toBe(0);
  expect(setCurrentHour(new Date()).getSeconds()).toBe(0);
  expect(setCurrentHour(new Date()).getMilliseconds()).toBe(0);
});

test("test getFirstDayOfMonth", () => {
  expect(getFirstDayOfMonth(new Date(2020, 2, 6, 0, 0, 0, 0))).toEqual(
    new Date(2020, 2, 1)
  );
});

test("test getDatesToDisplay", () => {
  const datesToDisplay = getDatesToDisplay(new Date(2020, 1, 6, 0, 0, 0, 0));
  expect(datesToDisplay[0][0]).toEqual(new Date(2020, 0, 27));
  expect(datesToDisplay[4][6]).toEqual(new Date(2020, 2, 1));
});
