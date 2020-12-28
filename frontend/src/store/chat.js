import { createSlice, current } from "@reduxjs/toolkit";
import { api } from "../extras/api";
import { showNotification } from "./notifier";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    socketConnected: false,
    threads: [],
    activeThread: undefined,
  },
  reducers: {
    socketConnected(state, action) {
      state.socket = action.payload;
      state.socketConnected = true;
    },
    socketDisconnect(state) {
      state.socketConnected = false;
      state.socket = undefined;
    },
    setThreads(state, action) {
      state.threads = action.payload;
    },
    changeActiveThread(state, action) {
      state.activeThread = action.payload;
    },
    addMessage(state, action) {
      const message = action.payload;
      const thread_id = message.thread;

      if (thread_id === state.activeThread.id) {
        state.activeThread.messages.push(message);
        state.threads
          .find((thread) => thread.id === state.activeThread.id)
          .messages.push(action.payload);
      } else {
        state.threads
          .find((thread) => thread.id === thread_id)
          .messages.push(action.payload);
      }
    },
  },
});

export const addMessageWithNotification = (msg, notification) => (
  dispatch,
  getState
) => {
  const { tabs } = getState();

  if (tabs.tabVal === "tasks") {
    dispatch(showNotification("Message received"));
  }

  dispatch(addMessage({ ...msg }));
};

export const {
  socketConnected,
  socketDisconnect,
  setThreads,
  changeActiveThread,
  addMessage,
} = chatSlice.actions;
export default chatSlice.reducer;
