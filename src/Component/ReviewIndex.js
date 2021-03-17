import React, { useContext, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

import {
  withStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import { AppContext } from "./../context/context";
import AddQuizModal from "./AddQuizModal";
import axios from "axios";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";

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
    flexGrow: 1,
  },
  link: {
    display: "flex",
    color: "white",
    fontWidth: "bold",
    cursor: "pointer",
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
    fill: "white",
  },
});

const quizType = (type) => {
  switch (type) {
    case "0":
      return "50 questions";
    case "1":
      return "40 questions";
    default:
      return;
  }
};

const theme = createMuiTheme({
  overrides: {
    // Style sheet name ⚛️
    MuiBreadcrumbs: {
      // Name of the rule
      separator: {
        // Some CSS

        fontWeight: "bold",
        color: "white",
      },
    },
  },
});

const ReviewIndex = (props) => {
  const { classes } = props;
  const {
    host,
    current,
    user,
    currentQuiz,
    setMode,
    setCurrentQuiz,
  } = useContext(AppContext);
  const [score, setScore] = useState();
  useEffect(() => {
    if (currentQuiz) {
      const url = `http://${host}:5000/getscore?uid=${user.uid}&class_key=${currentQuiz.classKey}&quiz_key=${currentQuiz.quizKey}`;
      axios
        .get(url)
        .then((res) => {
          setScore(res.data.score_data);
        })
        .catch((err) => console.log(err.message));
    }
  }, [user, host, currentQuiz]);
  console.log(score);

  return (
    <Paper className={classes.paper}>
      <AppBar
        className={classes.searchBar}
        position="static"
        color="default"
        elevation={0}
      >
        <Toolbar>
          {currentQuiz ? (
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <ThemeProvider theme={theme}>
                  <Breadcrumbs separator="›" aria-label="breadcrumb">
                    <Link
                      color="inherit"
                      onClick={() => {
                        setMode("quiz");
                        setCurrentQuiz();
                      }}
                      className={classes.link}
                    >
                      <Typography className={classes.modeText} align="left">
                        Quiz
                      </Typography>
                    </Link>
                    <Link color="inherit" className={classes.link}>
                      <Typography className={classes.modeText} align="left">
                        {currentQuiz.quizName}
                      </Typography>
                    </Link>
                  </Breadcrumbs>
                </ThemeProvider>
              </Grid>
              <Grid item>
                <AddQuizModal />
              </Grid>
            </Grid>
          ) : null}
        </Toolbar>
      </AppBar>
      <div className={classes.contentWrapper}>TEST</div>
    </Paper>
  );
};
ReviewIndex.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ReviewIndex);
