import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    socketConnected: false,
    socket: undefined,
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
  },
});

export default chatSlice.reducer;

export const { socketConnected, socketDisconnect } = chatSlice.actions;
