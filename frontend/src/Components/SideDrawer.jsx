import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@material-ui/core";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeTeam } from "../store/data";
import { changeTab } from "../store/tabs";
import CreateTeam from "./CreateTeam";
import TabPanel from "./TabPanel";
import { motion } from "framer-motion";
import { drawerWidth } from "./MyAppBar";
import { StyledBadge } from "./StyledBadge";

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  button: {
    marginTop: theme.spacing(2),
  },
  // toolbar: theme.mixins.toolbar,
}));

export const SideVariants = {
  initial: {
    opacity: 0,
  },
  animate: { x: 0, opacity: 1, transition: { duration: 0.3 } },
};

const SideDrawer = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const teams = useSelector((state) => state.data.teams);
  const profile = useSelector((state) => state.auth.user.profile);
  const currentTab = useSelector((state) => state.tabs.tabVal);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const data = [
    {
      id: 1,
      path: "/person1",
      name: "kartik",
    },
    {
      id: 2,
      path: "/person2",
      name: "kartik2",
    },
  ];

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
    >
      <div className={classes.toolbar} />

      <Divider />
      <List>
        {profile ? (
          <Box px={2} py={4} display="flex" alignItems="center">
            <StyledBadge
              overlap="circle"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
            >
              <Avatar
                alt={profile.name}
                src={profile.image}
                className={classes.large}
              />
            </StyledBadge>

            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              ml={2}
            >
              <Typography variant="h5">{profile.name}</Typography>
              <Typography variant="subtitle1">{profile.designation}</Typography>
            </Box>
          </Box>
        ) : null}
      </List>
      <Tabs
        value={currentTab}
        onChange={(e, value) => {
          dispatch(changeTab(value));
        }}
        aria-label="simple tabs example"
      >
        <Tab label="Tasks" value="tasks" />
        <Tab label="Chat" value="chat" />
      </Tabs>
      <Divider />

      <TabPanel value={currentTab} index={"tasks"}>
        <motion.div
          variants={SideVariants}
          initial={{
            x: 100,
            ...SideVariants.initial,
          }}
          animate="animate"
        >
          <div className="createteambtn">
            <List>
              <Button
                variant="contained"
                color="primary"
                size="small"
                fullWidth
                className={classes.button}
                onClick={handleClickOpen}
              >
                Create Team
              </Button>
            </List>
          </div>
          <List>
            {teams
              ? teams.map((val) => {
                  return (
                    <ListItem
                      button
                      key={val.id}
                      onClick={() => {
                        dispatch(changeTeam(val.id));
                      }}
                    >
                      <ListItemIcon>
                        <Avatar key={val.id} alt={val.name} src="/t" />
                      </ListItemIcon>
                      <ListItemText primary={val.name} />
                      <ListItemSecondaryAction>
                        <AvatarGroup max={2}>
                          {val.users.map((user) => {
                            return (
                              <Avatar
                                key={user.id}
                                alt="Cindy Baker"
                                src={user.profile ? user.profile.image : null}
                              />
                            );
                          })}
                        </AvatarGroup>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })
              : null}
          </List>
        </motion.div>
      </TabPanel>

      <TabPanel value={currentTab} index={"chat"}>
        <motion.div
          variants={SideVariants}
          initial={{
            x: -100,
            ...SideVariants.initial,
          }}
          animate="animate"
        >
          {/* <BottomAppBar /> */}
          <List>
            <ListItem>
              <TextField label={"Search Chats"} variant="outlined" fullWidth />
            </ListItem>
          </List>
          <List>
            {data
              ? data.map((val) => {
                  return (
                    <ListItem
                      button
                      key={val.id}
                      onClick={() => {
                        return;
                      }}
                    >
                      <ListItemIcon>
                        <StyledBadge
                          overlap="circle"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          variant="dot"
                        >
                          <Avatar key={val.id} alt={val.name} src="/t" />
                        </StyledBadge>
                      </ListItemIcon>
                      <ListItemText primary={val.name} />
                    </ListItem>
                  );
                })
              : null}
          </List>
        </motion.div>
      </TabPanel>
      <Divider />

      <CreateTeam open={dialogOpen} handleClose={handleClose}></CreateTeam>
    </Drawer>
  );
};

export default SideDrawer;
