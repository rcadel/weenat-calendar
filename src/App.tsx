import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MainCalendar } from "./Calendar";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <CssBaseline />
      <MainCalendar />
    </div>
  );
};

export default App;
