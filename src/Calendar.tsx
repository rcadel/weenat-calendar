import React, { useContext, useReducer } from "react";
import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Backdrop from "@material-ui/core/Backdrop";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { getMonthName } from "Calendar.service";
import { AddEventForm } from "AddEventForm";
import {
  calendarReducer,
  initialState,
  CalendarContext,
  CalendarContextProvider
} from "Calendar.reducer";
import { Day } from "Day";

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
      <Typography
        variant="h4"
        gutterBottom
        style={{ textTransform: "capitalize", width: "20%" }}
      >
        {getMonthName(calendar.state.month, "MMMM yyyy")}
      </Typography>
      <ChevronRightIcon
        onClick={handleIncrement}
        style={{ cursor: "pointer" }}
      />
    </div>
  );
};

export const MainCalendar = () => {
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
          <Month dates={calendar.datesToDisplay} />
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
                  if (event.id === "") {
                    dispatch({ type: "addEvent", ...event });
                  } else {
                    dispatch({ type: "editEvent", ...event });
                  }
                  dispatch({ type: "hideAddEventForm" });
                }}
                defaultDate={calendar.defaultDateAddEventForm}
                defaultEvent={calendar.editingEvent}
              />
            </Fade>
          </Modal>
        </div>
      </CalendarContextProvider>
    </>
  );
};
