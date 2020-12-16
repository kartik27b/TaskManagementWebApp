import React from "react";
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
import MyAppBar from "../Components/MyAppBar";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  root: {
    display: "flex",
  },

  toolbar: theme.mixins.toolbar,
  content: {
    height: "100vh",
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    overflowY: "scroll",
  },
}));

export default function MainPage() {
  const classes = useStyles();

  const dispatch = useDispatch();

  const state = useSelector((state) => state);
  const isDataLoading = state.data.isDataLoading;
  const team = state.data.team;
  const team_tasks = state.data.team_tasks;

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

  return (
    <div className={classes.root}>
      <CssBaseline />
      {isDataLoading ? (
        <Loader></Loader>
      ) : (
        <React.Fragment>
          <MyAppBar></MyAppBar>
          <SideDrawer></SideDrawer>

          <main className={classes.content}>
            <div className={classes.toolbar} />
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
          </main>
        </React.Fragment>
      )}
    </div>
  );
}
