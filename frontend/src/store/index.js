import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import auth from "./user";
import data from "./data";
import theme from "./theme";
import tabs from "./tabs";
import chat from "./chat";

const reducer = combineReducers({
  auth,
  data,
  theme,
  tabs,
  chat,
});

const store = configureStore({
  reducer,
});

export default store;
