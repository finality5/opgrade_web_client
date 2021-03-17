import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";

import { AppContext } from "./context/context";
import StudentIndex from "./Component/StudentIndex";
import ClassIndex from "./Component/ClassIndex";
import QuizIndex from "./Component/QuizIndex";
import StatIndex from "./Component/StatIndex";
import ReviewIndex from "./Component/ReviewIndex";

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
  //console.log(mode);
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
          case "review":
              return <ReviewIndex />;
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
