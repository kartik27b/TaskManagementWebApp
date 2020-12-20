import "./App.css";
import LoginPage from "./Pages/LoginPage";
import {
  HashRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import MainPage from "./Pages/MainPage";
import SignupPage from "./Pages/SignupPage";
import Lottie from "react-lottie";

import { useEffect, useState } from "react";
import PrivateRoute from "./Components/PrivateRoute";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./store/user";
import PublicRoute from "./Components/PublicRoute";
import Loader from "./Components/Loader";
import ChatPage from "./Pages/ChatPage";

function App() {
  // const [loading, setLoading] = useState(true);

  const loading = useSelector((state) => state.auth.loading);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(login());
  }, []);

  return (
    <Router>
      <div className="App">
        {!loading ? (
          <Switch>
            <PrivateRoute exact path="/" component={MainPage}></PrivateRoute>
            <PublicRoute
              exact
              path="/login"
              component={LoginPage}
            ></PublicRoute>
            <Route exact path="/signup" component={SignupPage}></Route>
          </Switch>
        ) : (
          <Loader></Loader>
        )}
      </div>
    </Router>
  );
}

export default App;
