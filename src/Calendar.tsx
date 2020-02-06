import React, { useContext, useReducer } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import uuid from "uuid/v4";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import {
  getMonthName,
  getDatesToDisplay,
  getDayName,
  getMonth,
  formatDate,
  isInMonth,
  isToday,
  incrementMonth,
  decrementMonth
} from "Calendar.service";

const DATE_TO_KEY_PATTERN = "dd-MM-yyyy";

const getKey = (date: Date) => {
  return formatDate(date, DATE_TO_KEY_PATTERN);
};

type Action =
  | { type: "addEvent"; date: Date; label: string }
  | { type: "deleteEvent"; date: Date; id: string }
  | { type: "incrementMonth" }
  | { type: "decrementMonth" };

function calendarReducer(state: Calendar, action: Action): Calendar {
  const eventsPerDate = { ...state.eventsPerDate };
  let currentEventsAtDate;
  switch (action.type) {
    case "addEvent":
      currentEventsAtDate = eventsPerDate[getKey(action.date)] || [];
      const withNewEvent: Event[] = [
        ...currentEventsAtDate,
        { libelle: action.label, id: uuid() }
      ];

      return {
        ...state,
        eventsPerDate: {
          ...state.eventsPerDate,
          [getKey(action.date)]: withNewEvent
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
      return { ...state, month, datesToDisplay: getDatesToDisplay(month) };
    case "incrementMonth":
      const newMonth = incrementMonth(state.month);
      return {
        ...state,
        month: newMonth,
        datesToDisplay: getDatesToDisplay(newMonth)
      };
  }
}

interface Event {
  libelle: string;
  id: string;
}

interface Events {
  [key: string]: Event[];
}

interface Calendar {
  month: Date;
  datesToDisplay: Date[][];
  eventsPerDate: Events;
}

const initialState = {
  datesToDisplay: getDatesToDisplay(new Date()),
  month: new Date(),
  eventsPerDate: {}
};

const CalendarContext = React.createContext<{
  state: Calendar;
  dispatch?: React.Dispatch<Action>;
}>({
  state: initialState
});

const CalendarContextProvider = CalendarContext.Provider;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      height: "80vh",
      width: "80vw",
      margin: "auto"
    },
    paper: {
      padding: theme.spacing(0),
      textAlign: "center",
      color: theme.palette.text.secondary
    }
  })
);

export const Month = React.memo(({ dates }: { dates: Date[][] }) => {
  const weeks = dates.map((week, idx) => {
    return <Week key={idx} position={idx} week={week} />;
  });
  return (
    <Grid container spacing={0} direction={"column"} style={{ height: "100%" }}>
      {weeks}
    </Grid>
  );
});

export const Week = ({
  position,
  week
}: {
  position: number;
  week: Date[];
}) => {
  const days = week.map((day, idx) => {
    return (
      <Day
        key={`${position}_${idx}`}
        day={day}
        displayDayName={position === 0}
      />
    );
  });
  return (
    <Grid container item style={{ flex: 1 }}>
      {days}
    </Grid>
  );
};

const CalendarEvent = ({
  label,
  onDelete
}: {
  label: string;
  onDelete: () => void;
}) => {
  return (
    <div>
      {label}{" "}
      <span
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          onDelete();
        }}
      >
        delete
      </span>
    </div>
  );
};

export const DayContent = ({
  day,
  displayDayName
}: {
  day: Date;
  displayDayName: boolean;
}) => {
  const calendar = useContext(CalendarContext);
  const eventsAtDate = calendar.state.eventsPerDate[getKey(day)] || [];
  const style: React.CSSProperties = !isInMonth(
    day,
    getMonth(calendar.state.month)
  )
    ? { color: "grey" }
    : isToday(day)
    ? { color: "blue" }
    : {};
  const deleteEvent = (id: string) => {
    if (typeof calendar.dispatch !== "undefined") {
      calendar.dispatch({ type: "deleteEvent", date: day, id });
    }
  };
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div>{displayDayName ? getDayName(day) : ""}</div>
      <div style={style}>{formatDate(day)}</div>
      <div>
        {eventsAtDate.map(event => {
          return (
            <CalendarEvent
              key={event.id}
              label={event.libelle}
              onDelete={deleteEvent.bind(undefined, event.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export const Day = ({
  day,
  displayDayName
}: {
  day: Date;
  displayDayName: boolean;
}) => {
  const calendar = useContext(CalendarContext);
  const handleClick = () => {
    if (typeof calendar.dispatch !== "undefined") {
      calendar.dispatch({ type: "addEvent", date: day, label: "event" });
    }
  };
  return (
    <Grid item xs>
      <Paper
        variant="outlined"
        square
        elevation={0}
        style={{ height: "100%" }}
        onClick={handleClick}
      >
        <DayContent day={day} displayDayName={displayDayName} />
      </Paper>
    </Grid>
  );
};

export const Calendar = () => {
  const classes = useStyles();
  const [calendar, dispatch] = useReducer(calendarReducer, initialState);

  const handleIncrement = () => {
    dispatch({ type: "incrementMonth" });
  };
  const handleDecrement = () => {
    dispatch({ type: "decrementMonth" });
  };
  return (
    <>
      <CalendarContextProvider value={{ state: calendar, dispatch }}>
        <div onClick={handleDecrement}>moins</div>
        <div style={{ textTransform: "capitalize" }}>
          {getMonthName(calendar.month)}
        </div>
        <div onClick={handleIncrement}>plus</div>
        <div className={classes.root}>
          <Month dates={calendar.datesToDisplay} />
        </div>
      </CalendarContextProvider>
    </>
  );
};
