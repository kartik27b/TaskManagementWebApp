import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import auth from "./user";
import data from "./data";
import theme from "./theme";
import tabs from "./tabs";
import chat from "./chat";
import notifier from "./notifier";

const reducer = combineReducers({
  auth,
  data,
  theme,
  tabs,
  chat,
  notifier,
});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
