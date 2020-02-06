import {
  formatDate,
  decrementMonth,
  getDatesToDisplay,
  incrementMonth
} from "Calendar.service";
import uuid from "uuid/v4";
import React, { useReducer } from "react";

export type Action =
  | { type: "addEvent"; startDate: Date; endDate: Date; name: string }
  | {
      type: "editEvent";
      startDate: Date;
      endDate: Date;
      name: string;
      id: string;
    }
  | { type: "deleteEvent"; date: Date; id: string }
  | { type: "incrementMonth" }
  | { type: "decrementMonth" }
  | { type: "displayAddEventForm"; date: Date; id?: string }
  | { type: "hideAddEventForm" }
  | { type: "goToday" };

export interface Events {
  [key: string]: Event[];
}

export interface Calendar {
  month: Date;
  datesToDisplay: Date[][];
  eventsPerDate: Events;
  displayAddEventForm: boolean;
  defaultDateAddEventForm: Date;
  editingEvent?: Event;
}

export interface Event {
  name: string;
  startDate: Date;
  endDate: Date;
  id: string;
}

const DATE_TO_KEY_PATTERN = "dd-MM-yyyy";

/**
 * transform date to key inside calendar events map
 * @param date
 */
const getKey = (date: Date) => {
  return formatDate(date, DATE_TO_KEY_PATTERN);
};

/**
 * return events at specific date or empty array
 * @param calendarToUse
 * @param date
 */
export const getEventsAtDate = (calendarToUse: Calendar, date: Date) => {
  return calendarToUse.eventsPerDate[getKey(date)] || [];
};

/**
 * reducer use to handle UI state machine
 * @param state ui state
 * @param action action to modify UI
 */
export function calendarReducer(state: Calendar, action: Action): Calendar {
  const eventsPerDate = { ...state.eventsPerDate };
  let currentEventsAtDate;
  switch (action.type) {
    case "addEvent":
      currentEventsAtDate = eventsPerDate[getKey(action.startDate)] || [];
      const withNewEvent: Event[] = [
        ...currentEventsAtDate,
        {
          name: action.name,
          id: uuid(),
          startDate: action.startDate,
          endDate: action.endDate
        }
      ];

      return {
        ...state,
        eventsPerDate: {
          ...state.eventsPerDate,
          [getKey(action.startDate)]: withNewEvent
        }
      };
    case "editEvent":
      currentEventsAtDate = eventsPerDate[getKey(action.startDate)] || [];
      const withEditedEvent: Event[] = [
        ...currentEventsAtDate.filter(event => {
          return event.id !== action.id;
        }),
        { ...action }
      ];

      return {
        ...state,
        eventsPerDate: {
          ...state.eventsPerDate,
          [getKey(action.startDate)]: withEditedEvent
        }
      };
    case "deleteEvent":
      currentEventsAtDate = eventsPerDate[getKey(action.date)] || [];
      const withoudDeletedEvent: Event[] = currentEventsAtDate.filter(event => {
        return event.id !== action.id;
      });

      return {
        ...state,
        eventsPerDate: {
          ...state.eventsPerDate,
          [getKey(action.date)]: withoudDeletedEvent
        }
      };
    case "decrementMonth":
      const month = decrementMonth(state.month);
      return {
        ...state,
        month,
        datesToDisplay: getDatesToDisplay(month)
      };
    case "incrementMonth":
      const newMonth = incrementMonth(state.month);
      return {
        ...state,
        month: newMonth,
        datesToDisplay: getDatesToDisplay(newMonth)
      };
    case "displayAddEventForm":
      let editingEvent;
      if (typeof action.id !== "undefined") {
        editingEvent = state.eventsPerDate[getKey(action.date)].find(evt => {
          return evt.id === action.id;
        });
      }
      return {
        ...state,
        displayAddEventForm: true,
        defaultDateAddEventForm: action.date,
        editingEvent
      };
    case "hideAddEventForm":
      return { ...state, displayAddEventForm: false };
    case "goToday":
      return {
        ...state,
        month: new Date(),
        datesToDisplay: getDatesToDisplay(new Date())
      };
  }
}

export const initialState: Calendar = {
  datesToDisplay: getDatesToDisplay(new Date()),
  month: new Date(),
  eventsPerDate: {},
  displayAddEventForm: false,
  defaultDateAddEventForm: new Date(),
  editingEvent: undefined
};

export const CalendarContext = React.createContext<{
  state: Calendar;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => {}
});

export const CalendarContextProvider = CalendarContext.Provider;

export const useCalendarReducer = () => {
  return useReducer(calendarReducer, initialState);
};
