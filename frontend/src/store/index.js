import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import auth from "./user";
import data from "./data";
import theme from "./theme";

const reducer = combineReducers({
  auth,
  data,
  theme,
});

const store = configureStore({
  reducer,
});

export default store;
