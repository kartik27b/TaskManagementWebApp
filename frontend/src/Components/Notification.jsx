import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useDispatch, useSelector } from "react-redux";
import { closeNotification } from "../store/notifier";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Notification() {
  const notifier = useSelector((state) => state.notifier);
  const dispatch = useDispatch();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(closeNotification());
  };

  return (
    <Snackbar
      open={notifier.open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity="info">
        {notifier.message}
      </Alert>
    </Snackbar>
  );
}
