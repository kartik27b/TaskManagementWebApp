import { createSlice } from "@reduxjs/toolkit";

const tabSlice = createSlice({
  name: "tabs",
  initialState: {
    tabVal: "tasks",
  },
  reducers: {
    changeTab(state, action) {
      state.tabVal = action.payload;
    },
  },
});

export default tabSlice.reducer;

export const { changeTab } = tabSlice.actions;
