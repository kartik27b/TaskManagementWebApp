import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import { Box, Button, Grid, makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CreateTask from "./CreateTask";
import { useDrop } from "react-dnd";

const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: "white",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    borderRadius: theme.spacing(1),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    minHeight: theme.spacing(15),
  },
}));

const Column = ({ children, id, title, teamId }) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "type1",
    drop: () => ({ category: id }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid ref={drop} item md={4} sm={4} xs={12}>
      <Box
        className={classes.root}
        style={{
          backgroundColor: isOver ? "#22a6b3" : null,
          transition: "background-color 0.2s ease-out",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            variant="h6"
            // style={{ color: isOver ? "white" : "black" }}
          >
            {title}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            startIcon={<AddIcon></AddIcon>}
            onClick={handleOpen}
          >
            Add Task
          </Button>
        </Box>
        {children}
      </Box>
      <CreateTask
        open={open}
        handleClose={handleClose}
        teamId={teamId}
        category={id}
      ></CreateTask>
    </Grid>
  );
};

export default Column;
