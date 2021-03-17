import React, { useContext, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import DateRangeIcon from "@material-ui/icons/DateRange";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import { withStyles } from "@material-ui/core/styles";
import { AppContext } from "./../context/context";
import AddQuizModal from "./AddQuizModal";
import Axios from "axios";

const boxColor = [
  "#4294d0",
  "#2c393fff",
  "#78909cff",
  "#2c393fff",
  "#78909cff",
  "#4294d0",
  "#78909cff",
  "#4294d0",
  "#2c393fff",
];

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

const QuizIndex = (props) => {
  const { classes } = props;
  const { setUser, host, current, user, mode } = useContext(AppContext);
  const [quiz, setQuiz] = useState();
  useEffect(() => {
    if (current) {
      const url = `http://${host}:5000/getquiz?uid=${user.uid}&class_key=${current.class_key}`;
      Axios.get(url).then((res) => {
        setQuiz(res.data.quiz_data);
      });
    }
  }, [current, user, host]);
  console.log(quiz);
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
                Quiz
              </Typography>
            </Grid>
            <Grid item>
              <AddQuizModal />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <div className={classes.contentWrapper}>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          spacing={2}
        >
          {quiz
            ? quiz.map((obj, index) => (
              <Grid item xs={12} sm={4} key={ obj.quiz_key}>
                  <Card
                    style={{
                      width: 300,
                      height: 170,
                      backgroundColor: boxColor[index % 9],
                      borderRadius: 20,
                      padding: 10,
                    }}
                  >
                    <CardActionArea>
                      <CardContent>
                        <Typography
                          gutterBottom
                          variant="h6"
                          style={{ color: "white" }}
                        >
                          {obj.quiz_name}
                        </Typography>
                        <Grid
                          container
                          direction="row"
                          justify="flex-start"
                          alignItems="center"
                          spacing={1}
                          style={{ marginTop: 30 }}
                        >
                          <Grid item>
                            <DateRangeIcon style={{ fill: "white" }} />
                          </Grid>
                          <Grid item>
                            <Typography
                              gutterBottom
                              style={{ color: "white", fontWeight: "bold" }}
                            >
                              {obj.date}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          direction="row"
                          justify="flex-start"
                          alignItems="center"
                          spacing={1}
                        >
                          <Grid item>
                            <BookmarkBorderIcon style={{ fill: "white" }} />
                          </Grid>
                          <Grid item>
                            <Typography
                              gutterBottom
                              style={{ color: "white", fontWeight: "bold" }}
                            >
                              {quizType(obj.quiz_type)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))
            : null}
        </Grid>
      </div>
    </Paper>
  );
};
QuizIndex.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(QuizIndex);
