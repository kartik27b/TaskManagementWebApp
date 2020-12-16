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
  Typography,
} from "@material-ui/core";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeTeam } from "../store/data";
import CreateTeam from "./CreateTeam";

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
}));

const SideDrawer = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const teams = useSelector((state) => state.data.teams);
  const profile = useSelector((state) => state.auth.user.profile);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

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
            <Avatar
              alt={profile.name}
              src={profile.image}
              className={classes.large}
            />
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
      <Divider />
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
      <Divider />
      <div className="createteambtn">
        <List>
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.button}
            onClick={handleClickOpen}
          >
            Create Team
          </Button>
        </List>
      </div>

      <CreateTeam open={dialogOpen} handleClose={handleClose}></CreateTeam>
    </Drawer>
  );
};

export default SideDrawer;
