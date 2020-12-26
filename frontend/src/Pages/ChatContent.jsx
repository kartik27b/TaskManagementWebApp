import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Avatar from "@material-ui/core/Avatar";
import { Card, CardContent, TextField } from "@material-ui/core";
import { drawerWidth } from "../Components/MyAppBar";
import { useDispatch, useSelector } from "react-redux";
import { capitalizeString } from "../Components/TaskItem";
import WebSocketInstance from "../store/websocket";
import { addMessage } from "../store/chat";

const useStyles = makeStyles((theme) => ({
  text: {
    padding: theme.spacing(2, 2, 0),
  },
  paper: {
    marginLeft: drawerWidth,
    height: "100vh",
    overflowY: "scroll",
    // backgroundColor: theme.palette.background.default,
  },
  list: {
    marginBottom: theme.spacing(2),
  },
  subheader: {
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    top: "auto",
    bottom: 0,
  },
  grow: {
    flexGrow: 1,
  },
  fabButton: {
    position: "absolute",
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: "0 auto",
  },
  cardBottom: {
    position: "fixed",
    width: `calc(100% - ${drawerWidth}px)`,
    bottom: 5,
  },
}));

export default function ChatContent() {
  const classes = useStyles();
  const [message, setMessage] = useState("");
  const chat = useSelector((state) => state.chat);
  const user = useSelector((state) => state.auth.user);
  const thread = chat.activeThread;
  const messages = thread.messages;

  const chattingWith = thread.users.filter((curr) => curr.id !== user.id)[0];

  return (
    <React.Fragment>
      <CssBaseline />
      <Paper square className={classes.paper}>
        <Typography className={classes.text} variant="h5" gutterBottom>
          Chat with {capitalizeString(chattingWith.username)}
        </Typography>
        <List className={classes.list}>
          {messages.map(({ id }) => {
            const primary = "helli";
            const secondary = "hello";

            return (
              <React.Fragment key={id}>
                {id === 1 && (
                  <ListSubheader className={classes.subheader}>
                    Today
                  </ListSubheader>
                )}
                {id === 3 && (
                  <ListSubheader className={classes.subheader}>
                    Yesterday
                  </ListSubheader>
                )}
                <ListItem>
                  <ListItemAvatar>
                    <Avatar alt="Profile Picture" />
                  </ListItemAvatar>
                  <ListItemText primary={primary} secondary={secondary} />
                </ListItem>
              </React.Fragment>
            );
          })}
        </List>
        <Card className={classes.cardBottom}>
          <CardContent>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (message.length !== 0) {
                  const messageObject = {
                    id: Math.random(),
                    content: message,
                  };
                  WebSocketInstance.newChatMessage(messageObject);
                  setMessage("");
                }
              }}
            >
              <TextField
                label={"Message"}
                variant="outlined"
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </form>
          </CardContent>
        </Card>
      </Paper>
    </React.Fragment>
  );
}
