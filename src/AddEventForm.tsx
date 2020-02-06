import React, { useState, forwardRef, useRef, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
  KeyboardTimePicker
} from "@material-ui/pickers";
import { TextField, Button } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Event } from "./Calendar";
import { addHours } from "./Calendar.service";

const DATE_FORMAT = "dd/MM/yyyy";

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
export const AddEventForm = forwardRef(
  (
    {
      onAdd,
      defaultDate,
      defaultEvent
    }: {
      onAdd: (event: Event) => void;
      defaultDate: Date;
      defaultEvent?: Event;
    },
    ref
  ) => {
    const classes = useStyles();
    const defaultStartDate =
      typeof defaultEvent !== "undefined"
        ? defaultEvent.startDate
        : defaultDate;
    const defaultEndDate =
      typeof defaultEvent !== "undefined"
        ? defaultEvent.endDate
        : addHours(defaultDate, 1);
    const defaultName =
      typeof defaultEvent !== "undefined" ? defaultEvent.name : "";
    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);
    const [name, setName] = useState(defaultName);
    const nameRef = useRef<HTMLInputElement>();
    useEffect(() => {
      if (
        typeof nameRef !== "undefined" &&
        typeof nameRef.current !== "undefined"
      ) {
        nameRef.current.focus();
      }
    }, [startDate]);

    const handleChangeStartDate = (date: Date | null) => {
      if (date !== null) {
        setStartDate(date);
      }
    };
    const handleChangeEndDate = (date: Date | null) => {
      if (date !== null) {
        setEndDate(date);
      }
    };

    const handleEventNameChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setName(event.target.value);
    };

    const handleAddClick = () => {
      const id = typeof defaultEvent !== "undefined" ? defaultEvent.id : "";
      const eventForm: Event = {
        startDate,
        endDate,
        name,
        id
      };
      onAdd(eventForm);
    };
    const action = typeof defaultEvent !== "undefined" ? "Editer" : "Ajouter";
    return (
      <Paper innerRef={ref} className={classes.paper}>
        <h2>{action} un événement</h2>

        <div
          style={{
            display: "flex",
            alignItems: "bottom",
            justifyContent: "space-between"
          }}
        >
          <TextField
            inputRef={nameRef}
            id="standard-name"
            margin="dense"
            fullWidth
            required
            label="Nom de l'événement"
            value={name}
            onChange={handleEventNameChange}
          />
        </div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <KeyboardDatePicker
              margin="normal"
              label="Date de début"
              format={DATE_FORMAT}
              value={startDate}
              onChange={handleChangeStartDate}
              KeyboardButtonProps={{
                "aria-label": "change date"
              }}
            />
            <KeyboardTimePicker
              margin="normal"
              style={{ width: "35%" }}
              ampm={false}
              label="Heure de début"
              value={startDate}
              onChange={handleChangeStartDate}
              KeyboardButtonProps={{
                "aria-label": "change time"
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <KeyboardDatePicker
              margin="normal"
              label="Date de fin"
              format={DATE_FORMAT}
              value={endDate}
              onChange={handleChangeEndDate}
              KeyboardButtonProps={{
                "aria-label": "change date"
              }}
            />
            <KeyboardTimePicker
              margin="normal"
              style={{ width: "35%" }}
              ampm={false}
              label="Heure de fin"
              value={endDate}
              onChange={handleChangeEndDate}
              KeyboardButtonProps={{
                "aria-label": "change time"
              }}
            />
          </div>
        </MuiPickersUtilsProvider>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px"
          }}
        >
          <Button variant="contained" color="primary" onClick={handleAddClick}>
            {action}
          </Button>
        </div>
      </Paper>
    );
  }
);
