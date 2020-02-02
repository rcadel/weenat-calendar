import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

const days = [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "venredi",
  "samedi",
  "dimanche"
];

const getDayName = (dayNumber: number) => {
  return days[dayNumber];
};

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

export const Month = () => {
  const weeks = Array.from(Array(5).keys()).map(week => {
    return <Week key={week} position={week} />;
  });
  return (
    <Grid container spacing={0} direction={"column"} style={{ height: "100%" }}>
      {weeks}
    </Grid>
  );
};

export const Week = ({ position }: { position: number }) => {
  const days = Array.from(Array(7).keys()).map(day => {
    return (
      <Day
        key={`${position}_${day}`}
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
  day: number;
  displayDayName: boolean;
  position: number;
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div>{displayDayName ? getDayName(day) : ""}</div>
      <div>
        {position} {day}
      </div>
    </div>
  );
};

export const Day = ({
  position,
  day,
  displayDayName
}: {
  position: number;
  day: number;
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
    <div className={classes.root}>
      <Month />
    </div>
  );
};
