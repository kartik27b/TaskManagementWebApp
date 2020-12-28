const { createSlice } = require("@reduxjs/toolkit");

const notificationSlice = createSlice({
  name: "notifier",
  initialState: {
    open: false,
    message: undefined,
  },
  reducers: {
    showNotification(state, action) {
      state.message = action.payload;
      state.open = true;
    },
    closeNotification(state, action) {
      state.open = false;
    },
  },
});

export const {
  showNotification,
  closeNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
