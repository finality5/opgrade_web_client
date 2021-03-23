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
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import Tooltip from "@material-ui/core/Tooltip";
import WarningIcon from "@material-ui/icons/Warning";
import AssignmentLateIcon from "@material-ui/icons/AssignmentLate";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import AddImageModal from "./AddImageModal";
import LinearProgress from "@material-ui/core/LinearProgress";
import { saveAs } from "file-saver";

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
  margin: {
    margin: theme.spacing(1),
    position: "fixed",
    bottom: theme.spacing(4),
    right: theme.spacing(4),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
    fill: "white",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
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

    boxShadow: theme.shadows[1],
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

const ColorButton = withStyles((theme) => ({
  root: {
    minWidth: 100,
    color: "white",
    backgroundColor: "#2c393fff",
    "&:hover": {
      backgroundColor: "#2c393fff",
    },
  },
}))(Button);

const ReviewIndex = (props) => {
  const { classes } = props;
  const {
    host,
    current,
    user,
    currentQuiz,
    setMode,
    setCurrentQuiz,
    setOpenBox,
  } = useContext(AppContext);
  const [data, setData] = useState();
  const [isTicker, setTicker] = useState(false);
  const [grade, setGrade] = useState([]);
  const [ungrade, setUngrade] = useState([]);
  const [duplicate, setDuplicate] = useState([]);
  const [open, setOpen] = useState([]);
  const [selectDuplicate, setSelectDuplicate] = useState({
    studentKey: "",
    scoreKey: "",
  });
  const [isFetch, setFetch] = useState(false);

  useEffect(() => {
    if (currentQuiz) {
      setFetch(true);
      const url = `http://${host}:5000/getscore?uid=${user.uid}&class_key=${currentQuiz.classKey}&quiz_key=${currentQuiz.quizKey}`;
      axios
        .get(url)
        .then((res) => {
          setData(res.data.score_data);
        })
        .catch((err) => console.log(err.message));
      setFetch(false);
    }
  }, [user, host, currentQuiz, isTicker]);
  //console.log(grade, ungrade, duplicate);
  //console.log(grade)
  useEffect(() => {
    setFetch(true);
    if (data) {
      setOpen([...data.map((obj) => ({ key: obj.student_key, open: false }))]);
      setGrade([...data.filter((obj) => obj.graded && !obj.duplicate)]);
      setUngrade([...data.filter((obj) => !obj.graded && !obj.duplicate)]);
      setDuplicate([...data.filter((obj) => obj.graded && obj.duplicate)]);
      setFetch(false);
    }
  }, [data]);
  //console.log(gradeOpen)

  const exportHandler = (obj, student_id) => {
    let result = {};
    obj.result_answer.forEach((element, index) => {
      Object.assign(result, { [index + 1]: element + 1 });
    });
    const payload = {
      id: student_id,
      date: obj.date,
      key_name: obj.answer_name,
      score: obj.result,
      quiz_length: obj.total,
      student_answer: result,
    };

    let FileSaver = require("file-saver");
    let blob = new Blob([JSON.stringify(payload)], {
      type: "application/json",
    });
    FileSaver.saveAs(blob, `${student_id}_result.json`);
  };

  const handleOpen = (id) => {
    //console.log(id);
    setOpen([
      ...open.map((obj) =>
        obj.key === id ? { ...obj, open: !obj.open } : obj
      ),
    ]);
  };
  const handleClickAway = () => {
    setSelectDuplicate({ studentKey: "", scoreKey: "" });
  };

  const deleteScore = (scoreKey) => {
    //console.log(scoreKey);
    const url = `http://${host}:5000/deletescore`;
    const payload = {
      uid: user.uid,
      class_key: currentQuiz.classKey,
      score_key: scoreKey,
    };
    axios
      .post(url, payload)
      .then((res) => {
        console.log(res.data.message);
        setTicker(!isTicker);
      })
      .catch((err) => console.log(err));
  };

  const duplicateSubmit = () => {
    if (selectDuplicate.studentKey !== "" && selectDuplicate.scoreKey !== "") {
      //const filtered = student.quiz.filter((obj) => obj.score_key !== selectScore)
      let filteredStudent = duplicate.filter(
        (obj) => obj.student_key === selectDuplicate.studentKey
      );
      let filteredScore = filteredStudent[0]["quiz"].filter(
        (obj) => obj.score_key !== selectDuplicate.scoreKey
      );
      let data = [];
      filteredScore.forEach((obj) => data.push(obj.score_key));
      //console.log(data);
      const url = `http://${host}:5000/duplicate`;
      const payload = {
        uid: user.uid,
        class_key: currentQuiz.classKey,
        score_key: data,
      };
      axios.post(url, payload).then((res) => {
        if (res.status === 200) {
          setTicker(!isTicker);
          //console.log(res.data.message);
        } else {
          console.log(res.data.message);
        }
      });
    }
  };
  //console.log(selectDuplicate);
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
            {data ? (
              <Grid item>
                <AddImageModal isTicker={isTicker} setTicker={setTicker} />
              </Grid>
            ) : null}
          </Grid>
        </Toolbar>
      </AppBar>
      {!isFetch ? (
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
                    <ListItem
                      button
                      onClick={() => handleOpen(obj.student_key)}
                    >
                      <ListItemIcon>
                        <AccountBoxIcon style={{ fill: "green" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${obj.student_id} | ${obj.student_name}`}
                      />
                      {open.find((item) => item.key === obj.student_key)
                        .open ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </ListItem>
                    <Collapse
                      in={
                        open.find((item) => item.key === obj.student_key).open
                      }
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {obj.quiz
                          ? obj.quiz.map((obj2) => (
                              <ListItem
                                button
                                className={classes.nested}
                                key={obj2.score_key}
                              >
                                <Grid
                                  container
                                  direction="row"
                                  justify="flex-start"
                                  alignItems="center"
                                  spacing={5}
                                >
                                  <Grid item>
                                    <HtmlTooltip
                                      placement="right"
                                      title={
                                        <React.Fragment>
                                          <img
                                            width={500}
                                            src={obj2.url}
                                            alt="score"
                                          />
                                        </React.Fragment>
                                      }
                                    >
                                      <img
                                        width={200}
                                        src={obj2.url}
                                        alt="score"
                                      />
                                    </HtmlTooltip>
                                  </Grid>
                                  <Grid item>
                                    <Grid
                                      container
                                      direction="column"
                                      justify="center"
                                      alignItems="flex-start"
                                      spacing={1}
                                    >
                                      <Grid item>
                                        <Card
                                          style={{
                                            width: 200,
                                            backgroundColor: "#2c393fff",
                                            borderRadius: 20,
                                            padding: 10,
                                          }}
                                        >
                                          <CardActionArea>
                                            <CardContent>
                                              <Typography
                                                gutterBottom
                                                style={{ color: "white" }}
                                              >
                                                {`Student ID: ${obj.student_id}`}
                                              </Typography>
                                              <Typography
                                                gutterBottom
                                                style={{ color: "white" }}
                                              >
                                                {`Result: ${obj2.result} / ${obj2.total}`}
                                              </Typography>
                                              <Typography
                                                gutterBottom
                                                style={{ color: "white" }}
                                              >
                                                {`Key: ${obj2.answer_name}`}
                                              </Typography>
                                            </CardContent>
                                          </CardActionArea>
                                        </Card>
                                      </Grid>
                                      <Grid item>
                                        <ColorButton
                                          variant="contained"
                                          color="primary"
                                          onClick={() => setOpenBox(true)}
                                        >
                                          Re-grade
                                        </ColorButton>
                                      </Grid>
                                      <Grid item>
                                        <ColorButton
                                          variant="contained"
                                          color="primary"
                                          onClick={() =>
                                            exportHandler(obj2, obj.student_id)
                                          }
                                        >
                                          Export
                                        </ColorButton>
                                      </Grid>
                                      <Grid item>
                                        <ColorButton
                                          variant="contained"
                                          color="primary"
                                          onClick={() =>
                                            deleteScore(obj2.score_key)
                                          }
                                        >
                                          Remove
                                        </ColorButton>
                                      </Grid>
                                    </Grid>
                                  </Grid>
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
                    <ListItem
                      button
                      onClick={() => handleOpen(obj.student_key)}
                    >
                      <ListItemIcon>
                        <AccountBoxIcon style={{ fill: "grey" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${obj.student_id} | ${obj.student_name}`}
                      />
                      {open.find((item) => item.key === obj.student_key)
                        .open ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </ListItem>
                    <Collapse
                      in={
                        open.find((item) => item.key === obj.student_key).open
                      }
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        <ListItem button className={classes.nested}>
                          <ListItemIcon>
                            <AssignmentLateIcon style={{ fill: "grey" }} />
                          </ListItemIcon>
                          <ListItemText primary="Not graded yet" />
                        </ListItem>
                      </List>
                    </Collapse>
                  </React.Fragment>
                ))
              : null}
          </List>
          <ClickAwayListener onClickAway={handleClickAway}>
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
                      <ListItem
                        button
                        onClick={() => handleOpen(obj.student_key)}
                      >
                        <ListItemIcon>
                          <WarningIcon style={{ fill: "orange" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${obj.student_id} | ${obj.student_name}`}
                        />
                        {open.find((item) => item.key === obj.student_key)
                          .open ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </ListItem>
                      <Collapse
                        in={
                          open.find((item) => item.key === obj.student_key).open
                        }
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding>
                          {obj.quiz
                            ? obj.quiz.map((obj2) => (
                                <ListItem
                                  style={{
                                    backgroundColor:
                                      obj.student_key ===
                                        selectDuplicate.studentKey &&
                                      obj2.score_key ===
                                        selectDuplicate.scoreKey
                                        ? "#2c393fff"
                                        : null,
                                  }}
                                  button
                                  className={classes.nested}
                                  key={obj2.score_key}
                                  onClick={() =>
                                    setSelectDuplicate({
                                      studentKey: obj.student_key,
                                      scoreKey: obj2.score_key,
                                    })
                                  }
                                >
                                  <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="center"
                                    spacing={5}
                                  >
                                    <Grid item>
                                      <HtmlTooltip
                                        placement="right"
                                        title={
                                          <React.Fragment>
                                            <img
                                              width={500}
                                              src={obj2.url}
                                              alt="score"
                                            />
                                          </React.Fragment>
                                        }
                                      >
                                        <img
                                          width={200}
                                          src={obj2.url}
                                          alt="score"
                                        />
                                      </HtmlTooltip>
                                    </Grid>
                                    <Grid item>
                                      <Grid
                                        container
                                        direction="column"
                                        justify="center"
                                        alignItems="flex-start"
                                        spacing={1}
                                      >
                                        <Grid item>
                                          <Card
                                            style={{
                                              width: 200,
                                              backgroundColor:
                                                obj.student_key ===
                                                  selectDuplicate.studentKey &&
                                                obj2.score_key ===
                                                  selectDuplicate.scoreKey
                                                  ? "white"
                                                  : "#2c393fff",
                                              borderRadius: 20,
                                              padding: 10,
                                            }}
                                          >
                                            <CardActionArea>
                                              <CardContent>
                                                <Typography
                                                  gutterBottom
                                                  style={{
                                                    color:
                                                      obj.student_key ===
                                                        selectDuplicate.studentKey &&
                                                      obj2.score_key ===
                                                        selectDuplicate.scoreKey
                                                        ? "#2c393fff"
                                                        : "white",
                                                  }}
                                                >
                                                  {`Student ID: ${obj.student_id}`}
                                                </Typography>
                                                <Typography
                                                  gutterBottom
                                                  style={{
                                                    color:
                                                      obj.student_key ===
                                                        selectDuplicate.studentKey &&
                                                      obj2.score_key ===
                                                        selectDuplicate.scoreKey
                                                        ? "#2c393fff"
                                                        : "white",
                                                  }}
                                                >
                                                  {`Result: ${obj2.result}`}
                                                </Typography>
                                              </CardContent>
                                            </CardActionArea>
                                          </Card>
                                        </Grid>
                                      </Grid>
                                    </Grid>
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
          </ClickAwayListener>

          {selectDuplicate.studentKey !== "" &&
          selectDuplicate.scoreKey !== "" ? (
            <Fab
              variant="extended"
              color="primary"
              aria-label="add"
              className={classes.margin}
              onClick={() => duplicateSubmit()}
            >
              <CheckCircleIcon className={classes.extendedIcon} />
              Submit
            </Fab>
          ) : null}
        </div>
      ) : (
        <LinearProgress />
      )}
    </Paper>
  );
};
ReviewIndex.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ReviewIndex);
