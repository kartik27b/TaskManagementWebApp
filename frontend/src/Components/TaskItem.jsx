import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useDrag } from "react-dnd";
import { useDispatch } from "react-redux";
import { changeCategoryAsync } from "../store/data";
import { motion, AnimatePresence } from "framer-motion";
import { red } from "@material-ui/core/colors";
import BackspaceIcon from "@material-ui/icons/Backspace";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

const capitalizeString = (string) => {
  const words = string.toLowerCase().split(" ");

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1);
  }
  return words.join(" ");
};

const TaskItem = ({ name, task, deleteTask }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const changeTaskCategory = (task, category) => {
    dispatch(changeCategoryAsync({ task, category }));
  };

  const [, drag] = useDrag({
    item: { name, type: "type1" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();

      if (dropResult && dropResult.category) {
        changeTaskCategory(task, dropResult.category);
      }
    },
  });

  return (
    <AnimatePresence>
      <motion.div
        // initial={{ opacity: 0, y: 50, scale: 0.3 }}
        // animate={{ opacity: 1, y: 0, scale: 1 }}
        // exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.5 } }}
        ref={drag}
      >
        <Card className={classes.root}>
          <CardHeader
            avatar={
              <Avatar aria-label="recipe" className={classes.avatar}>
                R
              </Avatar>
            }
            action={
              <IconButton onClick={deleteTask}>
                <BackspaceIcon />
              </IconButton>
            }
            align="left"
            title={capitalizeString(task.task_name)}
            subheader={task.created_at.substring(0, 10)}
          />

          <CardContent align="left">
            <Typography variant="body1" color="textSecondary" component="p">
              {task.description}
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskItem;
