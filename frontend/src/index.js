import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import store from "./store";
import { Provider, useSelector } from "react-redux";
import { useEffect } from "react";

const extraConfig = {
  typography: {
    button: {
      textTransform: "none",
    },
  },
};

const lightTheme = {
  palette: {
    type: "light",
    primary: blue,
    secondary: {
      main: "#bbe1fa",
    },
  },
  ...extraConfig,
};

const darkTheme = {
  palette: {
    type: "dark",
    // primary: {
    //   main: "#0f4c75",
    // },
    primary: blue,
    secondary: {
      main: "#bbe1fa",
    },
  },
  ...extraConfig,
};

const AppWithTheme = ({ children }) => {
  const theme = useSelector((state) => state.theme.lightTheme);
  const appliedTheme = createMuiTheme(theme ? lightTheme : darkTheme);

  useEffect(() => {
    console.log(theme);
  }, []);

  return <ThemeProvider theme={appliedTheme}>{children}</ThemeProvider>;
};

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <AppWithTheme>
      <App />
    </AppWithTheme>
  </Provider>,
  // </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
