import { createSlice } from "@reduxjs/toolkit";
import { api } from "../extras/api";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    socketConnected: false,
    socket: undefined,
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
      state.activeThread.messages.push(action.payload);
      state.threads
        .find((thread) => thread.id === state.activeThread.id)
        .messages.push(action.payload);
    },
  },
});

export const {
  socketConnected,
  socketDisconnect,
  setThreads,
  changeActiveThread,
  addMessage,
} = chatSlice.actions;
export default chatSlice.reducer;
