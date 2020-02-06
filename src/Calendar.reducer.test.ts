import {
  calendarReducer,
  initialState,
  getKey,
  Event
} from "./Calendar.reducer";

test("action addEvent", () => {
  const eventToAdd: Event = {
    endDate: new Date(),
    name: "event",
    startDate: new Date(),
    id: ""
  };
  const newState = calendarReducer(initialState, {
    type: "addEvent",
    ...eventToAdd
  });
  const newEvent = newState.eventsPerDate[getKey(new Date())][0];
  expect(newEvent.name).toEqual(eventToAdd.name);
  expect(newEvent.startDate).toEqual(eventToAdd.startDate);
  expect(newEvent.endDate).toEqual(eventToAdd.endDate);
});

test("action decrementMonth", () => {
  const newState = calendarReducer(
    { ...initialState, month: new Date(2020, 2, 6, 0, 0, 0, 0) },
    {
      type: "decrementMonth"
    }
  );
  expect(newState.month).toEqual(new Date(2020, 1, 6, 0, 0, 0, 0));
});

test("action incrementMonth", () => {
  const newState = calendarReducer(
    { ...initialState, month: new Date(2020, 2, 6, 0, 0, 0, 0) },
    {
      type: "incrementMonth"
    }
  );
  expect(newState.month).toEqual(new Date(2020, 3, 6, 0, 0, 0, 0));
});

test("action deleteEvent", () => {
  const dateToTest = new Date(2020, 2, 6, 0, 0, 0, 0);
  const newState = calendarReducer(
    {
      ...initialState,
      eventsPerDate: {
        [getKey(dateToTest)]: [
          { id: "1", startDate: dateToTest, endDate: dateToTest, name: "test" }
        ]
      }
    },
    {
      type: "deleteEvent",
      id: "1",
      date: dateToTest
    }
  );
  expect(newState.eventsPerDate[getKey(dateToTest)]).toEqual([]);
});

test("action editEvent", () => {
  const dateToTest = new Date(2020, 2, 6, 0, 0, 0, 0);
  const nameToTest = "event1";
  const eventToEdit: Event = {
    endDate: dateToTest,
    name: nameToTest,
    startDate: dateToTest,
    id: "1"
  };
  const newState = calendarReducer(
    {
      ...initialState,
      eventsPerDate: {
        [getKey(dateToTest)]: [
          { id: "1", startDate: dateToTest, endDate: dateToTest, name: "test" }
        ]
      }
    },
    {
      type: "editEvent",
      ...eventToEdit
    }
  );
  expect(newState.eventsPerDate[getKey(dateToTest)][0].name).toEqual(
    nameToTest
  );
});

test("action goToday", () => {
  const newState = calendarReducer(
    { ...initialState, month: new Date(2020, 2, 6, 0, 0, 0, 0) },
    {
      type: "goToday"
    }
  );
  expect(newState.month.getDay()).toEqual(new Date().getDay());
  expect(newState.month.getFullYear()).toEqual(new Date().getFullYear());
  expect(newState.month.getMonth()).toEqual(new Date().getMonth());
});
