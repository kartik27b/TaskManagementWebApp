import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Loader from "../Components/Loader";
import { deleteTaskState } from "../store/data";

import { Grid } from "@material-ui/core";
import Column from "../Components/Column";
import TaskItem from "../Components/TaskItem";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../extras/api";
import SideDrawer from "../Components/SideDrawer";
import MyAppBar, { drawerWidth } from "../Components/MyAppBar";
import TabPanel from "../Components/TabPanel";
import { addMessageWithNotification, socketConnected } from "../store/chat";
import { motion } from "framer-motion";
import ChatPage from "./ChatContent";
import WebSocketInstance from "../store/websocket";
import Notification from "../Components/Notification";

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

export const mainVariants = {
  initial: {
    opacity: 0,
  },
  animate: { opacity: 1, transition: { duration: 0.5 } },
};

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

  function waitForSocketConnection(callback) {
    setTimeout(function () {
      if (WebSocketInstance.state() === 1) {
        console.log("Connection is made");
        callback();
        return;
      } else {
        console.log("wait for connection...");
        waitForSocketConnection(callback);
      }
    }, 100);
  }

  function initialiseChat() {
    waitForSocketConnection(() => {
      // WebSocketInstance.fetchMessages(
      //   this.props.username,
      //   this.props.match.params.chatID
      // );

      console.log("Should do something here");
    });
    WebSocketInstance.connect(state.auth.token);
    dispatch(socketConnected());
  }

  useEffect(() => {
    initialiseChat();
    WebSocketInstance.addCallbacks(
      () => {},
      (msg) => {
        console.log(msg, " received");
        // if (currentTab === "tasks") {
        //   console.log(currentTab);
        //   // dispatch(showNotification("Message Received"));
        //   console.log("this dispatch is called");
        // }
        // dispatch(addMessage({ ...msg }));
        dispatch(addMessageWithNotification({ ...msg }, "Helo world"));
      }
    );
  }, []);

  return (
    <div className={classes.root}>
      <CssBaseline />
      {isDataLoading ? (
        <Loader />
      ) : (
        <React.Fragment>
          <SideDrawer />

          <TabPanel value={currentTab} index={"tasks"}>
            <MyAppBar />
            <main className={classes.content}>
              <div className={classes.toolbar} />
              <motion.div
                variants={mainVariants}
                initial="initial"
                animate="animate"
                transition="transition"
              >
                <Grid container spacing={2}>
                  <DndProvider backend={HTML5Backend}>
                    {team &&
                      team.team_categories.map((val) => {
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
                      })}
                  </DndProvider>
                </Grid>
              </motion.div>
              <Notification />
            </main>
          </TabPanel>

          <TabPanel value={currentTab} index={"chat"}>
            <motion.div
              variants={mainVariants}
              initial="initial"
              animate="animate"
              transition="transition"
            >
              <ChatPage />
            </motion.div>
          </TabPanel>
        </React.Fragment>
      )}
    </div>
  );
}
