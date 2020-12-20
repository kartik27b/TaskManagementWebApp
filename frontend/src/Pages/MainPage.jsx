import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Loader from "../Components/Loader";
import { deleteTaskState } from "../store/data";

import {
  Avatar,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from "@material-ui/core";
import Column from "../Components/Column";
import TaskItem from "../Components/TaskItem";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../extras/api";
import SideDrawer from "../Components/SideDrawer";
import MyAppBar, { drawerWidth } from "../Components/MyAppBar";
import TabPanel from "../Components/TabPanel";
import { socketConnected, socketDisconnect } from "../store/user";
import { AnimatePresence, motion } from "framer-motion";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  root: {
    flexGrow: 1,
  },

  toolbar: theme.mixins.toolbar,
  content: {
    // display: 'flex',
    height: "100vh",
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    flex: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    overflowY: "scroll",
  },
  cardBottom: {
    position: "fixed",
    width: "75%",
    bottom: 20,
  },
  inline: {
    display: "inline",
  },
}));

export default function MainPage() {
  const classes = useStyles();

  const dispatch = useDispatch();

  const state = useSelector((state) => state);
  const isDataLoading = state.data.isDataLoading;
  const team = state.data.team;
  const team_tasks = state.data.team_tasks;

  const currentTab = useSelector((state) => state.tabs.tabVal);

  const deleteTask = async (task) => {
    try {
      await api.get(`/deletetask/${task.id}/`);
      dispatch(deleteTaskState(task));
    } catch (e) {
      console.log(e);
    }
  };

  const getTasksForCategory = (id) => {
    return team_tasks
      .filter((task) => task.category === id)
      .map((task, i) => {
        return (
          <TaskItem
            ival={i}
            key={task.id}
            name={task.task_name}
            task={task}
            deleteTask={() => deleteTask(task)}
          ></TaskItem>
        );
      });
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");
    ws.onopen = () => {
      console.log("connected");
      dispatch(socketConnected(ws));
    };

    ws.onmessage = (e) => {
      console.log(e);
    };

    ws.onclose = () => {
      console.log("Disconnected");
      dispatch(socketDisconnect());
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className={classes.root}>
      <CssBaseline />
      {isDataLoading ? (
        <Loader></Loader>
      ) : (
        <React.Fragment>
          <SideDrawer></SideDrawer>

          <TabPanel value={currentTab} index={"tasks"}>
            {/* <div>Item One tasks</div> */}

            <MyAppBar></MyAppBar>

            <main className={classes.content}>
              <div className={classes.toolbar} />
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Grid container spacing={2}>
                  <DndProvider backend={HTML5Backend}>
                    {team
                      ? team.team_categories.map((val) => {
                          const id = val.id;
                          return (
                            <Column
                              key={id}
                              id={id}
                              title={val.name}
                              teamId={team.id}
                            >
                              {getTasksForCategory(id)}
                            </Column>
                          );
                        })
                      : null}
                  </DndProvider>
                </Grid>
              </motion.div>
            </main>
          </TabPanel>

          <TabPanel value={currentTab} index={"chat"}>
            <main className={classes.content}>
              {/* <div className={classes.toolbar} /> */}
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <List>
                  <ChatMessage />
                  <ChatMessage own />
                  <ChatMessage />
                </List>
                <Card className={classes.cardBottom}>
                  <CardContent>
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                      }}
                    >
                      <TextField
                        label={"Message"}
                        variant="outlined"
                        fullWidth
                      />
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </main>
          </TabPanel>
        </React.Fragment>
      )}
    </div>
  );
}

const ChatMessage = ({ own }) => {
  return (
    <ListItem alignItems="center">
      {!own && (
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
      )}
      <ListItemText primary="Brunch this weekend?" />
    </ListItem>
  );
};
