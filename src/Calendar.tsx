import React, { useContext, useReducer } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Slide from "@material-ui/core/Slide";
import Modal from "@material-ui/core/Modal";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DeleteIcon from "@material-ui/icons/Delete";
import Backdrop from "@material-ui/core/Backdrop";
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
import { Fade, Chip } from "@material-ui/core";
import { AddEventForm } from "AddEventForm";

const DATE_TO_KEY_PATTERN = "dd-MM-yyyy";

const getKey = (date: Date) => {
  return formatDate(date, DATE_TO_KEY_PATTERN);
};

type Action =
  | { type: "addEvent"; startDate: Date; endDate: Date; name: string }
  | { type: "deleteEvent"; date: Date; id: string }
  | { type: "incrementMonth" }
  | { type: "decrementMonth" }
  | { type: "displayAddEventForm"; date: Date }
  | { type: "hideAddEventForm" }
  | { type: "display" };

function calendarReducer(state: Calendar, action: Action): Calendar {
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
        datesToDisplay: getDatesToDisplay(month),
        display: false
      };
    case "incrementMonth":
      const newMonth = incrementMonth(state.month);
      return {
        ...state,
        month: newMonth,
        datesToDisplay: getDatesToDisplay(newMonth),
        display: false
      };
    case "displayAddEventForm":
      return {
        ...state,
        displayAddEventForm: true,
        defaultDateAddEventForm: action.date
      };
    case "hideAddEventForm":
      return { ...state, displayAddEventForm: false };
    case "display":
      return { ...state, display: true };
  }
}

interface Event {
  name: string;
  startDate: Date;
  endDate: Date;
  id: string;
}

interface Events {
  [key: string]: Event[];
}

interface Calendar {
  month: Date;
  datesToDisplay: Date[][];
  eventsPerDate: Events;
  displayAddEventForm: boolean;
  defaultDateAddEventForm: Date;
  display: boolean;
}

const initialState: Calendar = {
  datesToDisplay: getDatesToDisplay(new Date()),
  month: new Date(),
  eventsPerDate: {},
  displayAddEventForm: false,
  defaultDateAddEventForm: new Date(),
  display: true
};

const CalendarContext = React.createContext<{
  state: Calendar;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => {}
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
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3)
    }
  })
);

export const Month = React.memo(
  React.forwardRef(({ dates }: { dates: Date[][] }, ref) => {
    const weeks = dates.map((week, idx) => {
      return <Week key={idx} position={idx} week={week} />;
    });
    return (
      <Grid
        innerRef={ref}
        container
        spacing={0}
        direction={"column"}
        style={{ height: "100%" }}
      >
        {weeks}
      </Grid>
    );
  })
);

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
  onDelete,
  name,
  startDate,
  endDate
}: {
  onDelete: () => void;
} & Event) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
  };
  const formatHour = "HH:mm";
  const label = `${name} ${formatDate(startDate, formatHour)}-${formatDate(
    endDate,
    formatHour
  )}`;
  return <Chip label={label} color="primary" onDelete={handleDelete} />;
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
    calendar.dispatch({ type: "deleteEvent", date: day, id });
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
              {...event}
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
    calendar.dispatch({ type: "displayAddEventForm", date: day });
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

export const CalendarHeader = () => {
  const calendar = useContext(CalendarContext);
  const handleIncrement = () => {
    calendar.dispatch({ type: "incrementMonth" });
  };
  const handleDecrement = () => {
    calendar.dispatch({ type: "decrementMonth" });
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "10px"
      }}
    >
      <ChevronLeftIcon
        onClick={handleDecrement}
        style={{ cursor: "pointer" }}
      />
      <div style={{ textTransform: "capitalize" }}>
        {getMonthName(calendar.state.month, "MMMM yyyy")}
      </div>
      <ChevronRightIcon
        onClick={handleIncrement}
        style={{ cursor: "pointer" }}
      />
    </div>
  );
};

export const Calendar = () => {
  const classes = useStyles();
  const [calendar, dispatch] = useReducer(calendarReducer, initialState);

  const handleClose = () => {
    dispatch({ type: "hideAddEventForm" });
  };

  return (
    <>
      <CalendarContextProvider value={{ state: calendar, dispatch }}>
        <CalendarHeader />
        <div className={classes.root}>
          <Slide
            direction={calendar.display ? "left" : "right"}
            in={calendar.display}
            onExited={() => {
              dispatch({ type: "display" });
            }}
          >
            <Month dates={calendar.datesToDisplay} />
          </Slide>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={calendar.displayAddEventForm}
            className={classes.modal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500
            }}
            onClose={handleClose}
          >
            <Fade in={calendar.displayAddEventForm}>
              <AddEventForm
                onAdd={event => {
                  dispatch({ type: "addEvent", ...event });
                  dispatch({ type: "hideAddEventForm" });
                }}
                defaultDate={calendar.defaultDateAddEventForm}
              />
            </Fade>
          </Modal>
        </div>
      </CalendarContextProvider>
    </>
  );
};
