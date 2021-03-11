import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import RefreshIcon from "@material-ui/icons/Refresh";
import { AppContext } from "./context/context";
import StudentIndex from "./Component/StudentIndex";
import ClassIndex from "./Component/ClassIndex";
import QuizIndex from "./Component/QuizIndex";
import StatIndex from "./Component/StatIndex";
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

const ModeDisplay = (mode) => {
  switch (mode) {
    case "class":
      return "Class";
    case "quiz":
      return "Quiz";
    case "student":
      return "Student";
    case "stat":
      return "Statistic";
    default:
      return;
  }
};

const ContentDisplay = (mode) => {
  switch (mode) {
    case "class":
      return "Class";
    case "quiz":
      return "Quiz";
    case "student":
      return "Student";
    case "stat":
      return "Statistic";
    default:
      return;
  }
};

function Content(props) {
  const { classes } = props;
  const { setUser, setHost, current, user, mode } = useContext(AppContext);

  return mode
    ? (() => {
        switch (mode) {
          case "class":
            return <ClassIndex />;
          case "quiz":
            return <QuizIndex />;
          case "student":
            return <StudentIndex />;
          case "stat":
            return <StatIndex />;
          default:
            return null;
        }
      })()
    : null;
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Content);
