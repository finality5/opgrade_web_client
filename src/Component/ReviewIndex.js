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
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";

import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";
import PersonIcon from "@material-ui/icons/Person";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import Tooltip from "@material-ui/core/Tooltip";
import WarningIcon from '@material-ui/icons/Warning';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
const styles = (theme) => ({
  root: {
    width: "100%",
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
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

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    minWidth: 415,
    
    boxShadow: theme.shadows[1]
  },
}))(Tooltip);

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
  const [data, setData] = useState();

  const [grade, setGrade] = useState([]);
  const [ungrade, setUngrade] = useState([]);
  const [duplicate, setDuplicate] = useState([]);
  const [open, setOpen] = useState([]);

  useEffect(() => {
    if (currentQuiz) {
      const url = `http://${host}:5000/getscore?uid=${user.uid}&class_key=${currentQuiz.classKey}&quiz_key=${currentQuiz.quizKey}`;
      axios
        .get(url)
        .then((res) => {
          setData(res.data.score_data);
        })
        .catch((err) => console.log(err.message));
    }
  }, [user, host, currentQuiz]);
  //console.log(grade, ungrade, duplicate);

  useEffect(() => {
    if (data) {
      setOpen([...data.map((obj) => ({ key: obj.student_key, open: false }))]);
      setGrade([...data.filter((obj) => obj.graded && !obj.duplicate)]);
      setUngrade([...data.filter((obj) => !obj.graded && !obj.duplicate)]);
      setDuplicate([...data.filter((obj) => obj.graded && obj.duplicate)]);
    }
  }, [data]);
  //console.log(gradeOpen)

  const handleOpen = (id) => {
    //console.log(id);
    setOpen([
      ...open.map((obj) =>
        obj.key === id ? { ...obj, open: !obj.open } : obj
      ),
    ]);
  };
  //console.log(open);
  return (
    <Paper className={classes.paper}>
      <AppBar
        className={classes.searchBar}
        position="static"
        color="default"
        elevation={0}
      >
        <Toolbar>
          {data ? (
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
      <div className={classes.contentWrapper}>
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Graded
            </ListSubheader>
          }
          className={classes.root}
        >
          {grade
            ? grade.map((obj) => (
                <React.Fragment key={obj.student_key}>
                  <ListItem button onClick={() => handleOpen(obj.student_key)}>
                    <ListItemIcon>
                      <AccountBoxIcon style={{ fill: "green" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${obj.student_id} | ${obj.student_name}`}
                    />
                    {open.find((item) => item.key === obj.student_key).open ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </ListItem>
                  <Collapse
                    in={open.find((item) => item.key === obj.student_key).open}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {obj.quiz
                        ? obj.quiz.map((obj2) => (
                            <ListItem
                              button
                              className={classes.nested}
                              key={obj2.quiz_key}
                            >
                              <Grid
                                container
                                direction="row"
                                justify="flex-start"
                                alignItems="center"
                              >
                              <HtmlTooltip
                                placement="right"
                                  title={
                                    <React.Fragment>
                                      <img width={400} src={obj2.url} alt="score" />
                                    </React.Fragment>
                                  }
                                >
                                  <img width={100} src={obj2.url} alt="score" />
                                </HtmlTooltip>
                              </Grid>
                            </ListItem>
                          ))
                        : null}
                    </List>
                  </Collapse>
                </React.Fragment>
              ))
            : null}
        </List>
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Ungraded
            </ListSubheader>
          }
          className={classes.root}
        >
          {ungrade
            ? ungrade.map((obj) => (
                <React.Fragment key={obj.student_key}>
                  <ListItem button onClick={() => handleOpen(obj.student_key)}>
                    <ListItemIcon>
                      <AccountBoxIcon style={{ fill: "grey" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${obj.student_id} | ${obj.student_name}`}
                    />
                    {open.find((item) => item.key === obj.student_key).open ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </ListItem>
                  <Collapse
                    in={open.find((item) => item.key === obj.student_key).open}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      <ListItem button className={classes.nested}>
                        <ListItemIcon>
                          <AssignmentLateIcon />
                        </ListItemIcon>
                        <ListItemText primary="Not graded yet" />
                      </ListItem>
                    </List>
                  </Collapse>
                </React.Fragment>
              ))
            : null}
        </List>
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Duplicated
            </ListSubheader>
          }
          className={classes.root}
        >
          {duplicate
            ? duplicate.map((obj) => (
                <React.Fragment key={obj.student_key}>
                  <ListItem button onClick={() => handleOpen(obj.student_key)}>
                    <ListItemIcon>
                      <WarningIcon style={{ fill: "orange" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${obj.student_id} | ${obj.student_name}`}
                    />
                    {open.find((item) => item.key === obj.student_key).open ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </ListItem>
                  <Collapse
                    in={open.find((item) => item.key === obj.student_key).open}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      <ListItem button className={classes.nested}>
                        <ListItemIcon>
                          <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="Starred" />
                      </ListItem>
                    </List>
                  </Collapse>
                </React.Fragment>
              ))
            : null}
        </List>
      </div>
    </Paper>
  );
};
ReviewIndex.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ReviewIndex);
