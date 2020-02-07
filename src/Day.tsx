import React, { useContext } from "react";
import { CalendarContext, getEventsAtDate } from "./Calendar.reducer";
import {
  setCurrentHour,
  isInMonth,
  isToday,
  getMonth,
  getDayName,
  formatDate
} from "Calendar.service";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import { Event } from "Calendar.reducer";

export const Day = ({
  day,
  displayDayName
}: {
  day: Date;
  displayDayName: boolean;
}) => {
  const calendar = useContext(CalendarContext);
  const handleClick = () => {
    calendar.dispatch({
      type: "displayAddEventForm",
      date: setCurrentHour(day)
    });
  };
  return (
    <Grid item xs style={{ flexBasis: "14%", maxWidth: "14%" }}>
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

const DayContent = ({
  day,
  displayDayName
}: {
  day: Date;
  displayDayName: boolean;
}) => {
  const calendar = useContext(CalendarContext);
  const eventsAtDate = getEventsAtDate(calendar.state, day);
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
  const editEvent = (id: string) => {
    calendar.dispatch({ type: "displayAddEventForm", date: day, id });
  };
  return (
    <>
      {displayDayName ? <div> {getDayName(day)}</div> : ""}
      <div style={style}>{formatDate(day)}</div>
      {eventsAtDate.map(event => {
        return (
          <CalendarEvent
            key={event.id}
            {...event}
            onDelete={deleteEvent.bind(undefined, event.id)}
            onClick={editEvent.bind(undefined, event.id)}
          />
        );
      })}
    </>
  );
};

const CalendarEvent = ({
  onDelete,
  onClick,
  name,
  startDate,
  endDate
}: {
  onDelete: () => void;
  onClick: () => void;
} & Event) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
  };
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };
  const formatHour = "HH:mm";
  const label = `${formatDate(startDate, formatHour)}-${formatDate(
    endDate,
    formatHour
  )} ${name}`;
  return (
    <Chip
      style={{ width: "80%", margin: "0 0 10px 0" }}
      onClick={handleClick}
      size="small"
      label={label}
      color="primary"
      onDelete={handleDelete}
    />
  );
};
