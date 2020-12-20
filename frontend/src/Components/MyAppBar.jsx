import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  makeStyles,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@material-ui/core";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/user";
import CreateCategory from "./CreateCategory";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import { toggleTheme } from "../store/theme";
import AddIcon from "@material-ui/icons/Add";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

export const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
}));

const MyAppBar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const team = useSelector((state) => state.data.team);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const handleCategoryOpen = () => {
    setCategoryOpen(true);
  };

  const handleCategoryClose = () => {
    setCategoryOpen(false);
  };

  return (
    <motion.div
      initial={{
        y: -100,
        opacity: 0,
      }}
      animate={{ y: 0, opacity: 1 }}
      exit={{
        y: -100,
        transition: {
          duration: 1,
        },
      }}
      transition={{ duration: 0.5 }}
    >
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            {team ? team.name : "No team"}
          </Typography>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            style={{ marginLeft: "10px" }}
            onClick={handleCategoryOpen}
          >
            <AddIcon />
          </IconButton>
          <div className={classes.grow}></div>

          <IconButton
            color="inherit"
            edge="start"
            style={{ marginRight: "10px" }}
            onClick={() => dispatch(toggleTheme())}
          >
            <Brightness4Icon />
          </IconButton>
          <AvatarGroup max={3}>
            {team
              ? team.users.map((user) => {
                  return (
                    <Avatar
                      key={user.id}
                      alt="Cindy Baker"
                      src={user.profile ? user.profile.image : null}
                    />
                  );
                })
              : null}
          </AvatarGroup>
          <Box ml={2}>
            <Button
              variant="contained"
              onClick={() => {
                dispatch(logout());
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>

        <CreateCategory
          open={categoryOpen}
          handleClose={handleCategoryClose}
          teamId={team ? team.id : 0}
        ></CreateCategory>
      </AppBar>
    </motion.div>
    // </AnimatePresence>
  );
};

export default MyAppBar;
