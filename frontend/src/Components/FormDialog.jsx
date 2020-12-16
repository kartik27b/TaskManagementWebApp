import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Divider } from "@material-ui/core";

export default function FormDialog({
  open,
  handleClose = () => {},
  heading = "My heading",
  children,
}) {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth={"sm"}>
      <DialogTitle id="form-dialog-title">{heading}</DialogTitle>
      <Divider></Divider>
      {children}
    </Dialog>
  );
}
