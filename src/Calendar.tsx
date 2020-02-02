import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import {
  getCurrentMonthName,
  getDatesToDisplay,
  getDayName,
  formatDate
} from "Calendar.service";

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

export const Month = ({ dates }: { dates: Date[][] }) => {
  const weeks = dates.map((week, idx) => {
    return <Week key={idx} position={idx} week={week} />;
  });
  return (
    <Grid container spacing={0} direction={"column"} style={{ height: "100%" }}>
      {weeks}
    </Grid>
  );
};

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
        position={position}
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

export const DayContent = ({
  day,
  displayDayName,
  position
}: {
  day: Date;
  displayDayName: boolean;
  position: number;
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div>{displayDayName ? getDayName(day) : ""}</div>
      <div>{formatDate(day)}</div>
    </div>
  );
};

export const Day = ({
  position,
  day,
  displayDayName
}: {
  position: number;
  day: Date;
  displayDayName: boolean;
}) => {
  return (
    <Grid item xs>
      <Paper variant="outlined" square elevation={0} style={{ height: "100%" }}>
        <DayContent
          position={position}
          day={day}
          displayDayName={displayDayName}
        />
      </Paper>
    </Grid>
  );
};

export const Calendar = () => {
  const classes = useStyles();
  return (
    <>
      <div style={{ textTransform: "capitalize" }}>{getCurrentMonthName()}</div>
      <div className={classes.root}>
        <Month dates={getDatesToDisplay()} />
      </div>
    </>
  );
};
