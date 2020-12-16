import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    lightTheme: localStorage.getItem("light") === "true" ? true : false,
  },
  reducers: {
    toggleTheme(state) {
      state.lightTheme = !state.lightTheme;
      localStorage.setItem("light", state.lightTheme);
    },
  },
});

export default themeSlice.reducer;

export const { toggleTheme } = themeSlice.actions;
