import React, { useContext, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";


import { withStyles } from "@material-ui/core/styles";
import { AppContext } from "./../context/context";
import Axios from "axios";

const styles = (theme) => ({
  paper: {
    maxWidth: 936,
    margin: "auto",
    overflow: "hidden",
  },
  modeText: {
    color: "white",
    fontWeight: "bold",
  },

  searchBar: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    backgroundColor: theme.palette.primary.main,
  },
  block: {
    display: "block",
  },
  addUser: {
    marginRight: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  contentWrapper: {
    margin: "40px 16px",
  },
});

const QuizIndex = (props) => {
  const { classes } = props;
  const { setUser, host, current, user, mode } = useContext(AppContext);
  return (
    <Paper className={classes.paper}>
      <AppBar
        className={classes.searchBar}
        position="static"
        color="default"
        elevation={0}
      >
        <Toolbar>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <Typography className={classes.modeText} align="left">
                Student
              </Typography>
            </Grid>
            <Grid item>TEST</Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <div className={classes.contentWrapper}>
        <Grid container direction="column" justify="center" alignItems="center">
          <Grid item xs={8}>
            QUIZ
          </Grid>
        </Grid>
      </div>
    </Paper>
  );
};
QuizIndex.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(QuizIndex);
