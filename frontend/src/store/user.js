import { api } from "../extras/api";
import { getEverything } from "./data";

const { createSlice } = require("@reduxjs/toolkit");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    socketConnected: false,
    socket: undefined,
  },
  reducers: {
    loadingStart(state, action) {
      state.loading = true;
    },
    loadingStop(state, action) {
      state.loading = false;
    },
    loginSuccess(state, action) {
      const { user, token } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      state.token = token;
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Token ${token}`;
    },
    logout(state, action) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
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

export const login = () => async (dispatch) => {
  const loggedIn = localStorage.getItem("token") ? true : false;

  if (loggedIn) {
    try {
      dispatch(loadingStart());
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Token ${token}` },
      };

      const res = await api.get("/auth/user/", config);

      dispatch(
        loginSuccess({
          user: res.data.user,
          token: token,
        })
      );

      dispatch(loadingStop());
      dispatch(getEverything());
    } catch (err) {
      // console.log(err);
      dispatch(loadingStop());
    }
  }
};

export default authSlice.reducer;

export const {
  loginSuccess,
  logout,
  loadingStart,
  loadingStop,
  socketConnected,
  socketDisconnect,
} = authSlice.actions;
