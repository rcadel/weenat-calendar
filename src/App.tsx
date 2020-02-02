import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Calendar } from "./Calendar";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <CssBaseline />
      <Calendar />
    </div>
  );
};

export default App;
