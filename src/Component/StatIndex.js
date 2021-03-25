import React, { useContext, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import {
  withStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import { AppContext } from "./../context/context";
import Axios from "axios";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import { green, purple } from "@material-ui/core/colors";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";

import { scaleOrdinal } from "@vx/scale";
import { LegendOrdinal } from "@vx/legend";

import { color as colors } from "@data-ui/theme";
import { RadialChart, ArcSeries, ArcLabel } from "@data-ui/radial-chart";
import {
  Histogram,
  DensitySeries,
  BarSeries,
  withParentSize,
  XAxis,
  YAxis,
} from "@data-ui/histogram";
import LinearProgress from "@material-ui/core/LinearProgress";
const colorScale = scaleOrdinal({
  range: ["#00c7c7ff", "#4a86e8ff", "#674ea7ff", "#0b5394ff"],
});
const ResponsiveHistogram = withParentSize(
  ({ parentWidth, parentHeight, ...rest }) => (
    <Histogram width={parentWidth} height={parentHeight} {...rest} />
  )
);

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
  root: {
    width: "100%",
    maxWidth: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  button: {
    width: 100,
  },
});

const theme = createMuiTheme({
  palette: {
    primary: { main: "#2c393fff" },
  },
});

const StatIndex = (props) => {
  const { classes } = props;
  const { setUser, host, current, user, mode } = useContext(AppContext);
  const [stat, setStat] = useState();
  const [open, setOpen] = React.useState(true);

  //console.log(current);
  const handleClick = () => {
    setOpen(!open);
  };
  useEffect(() => {
    if (current) {
      const url = `http://${host}:5000/getstat?uid=${user.uid}&class_key=${current.class_key}`;
      Axios.get(url).then((res) => {
        if (res.data.stat_data) {
          setStat(res.data.stat_data);
        }
      });
    }
  }, [current, user]);

  console.log(stat);

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
                Statistic
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {stat ? (
        stat.map((obj) => (
          <div className={classes.contentWrapper} key={obj.quiz_key}>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={3}
            >
              <Grid item>
                <ThemeProvider theme={theme}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ width: 220 }}
                  >
                    {obj.quiz_name}
                  </Button>
                </ThemeProvider>
              </Grid>
            </Grid>
            <List
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Statistic
                </ListSubheader>
              }
              className={classes.root}
            >
              <ListItem button>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item>
                    <ThemeProvider theme={theme}>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                      >
                        Average
                      </Button>
                    </ThemeProvider>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" className={classes.button}>
                      {obj.stat.mean.toFixed(2)}
                    </Button>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem button>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item>
                    <ThemeProvider theme={theme}>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                      >
                        S.D.
                      </Button>
                    </ThemeProvider>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" className={classes.button}>
                      {obj.stat.std.toFixed(2)}
                    </Button>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem button>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item>
                    <ThemeProvider theme={theme}>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                      >
                        Median
                      </Button>
                    </ThemeProvider>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" className={classes.button}>
                      {obj.stat.median.toFixed(2)}
                    </Button>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem button>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item>
                    <ThemeProvider theme={theme}>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                      >
                        Mode
                      </Button>
                    </ThemeProvider>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" className={classes.button}>
                      {obj.stat.mode}
                    </Button>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem button>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item>
                    <ThemeProvider theme={theme}>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                      >
                        Max
                      </Button>
                    </ThemeProvider>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" className={classes.button}>
                      {obj.stat.max}
                    </Button>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem button>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item>
                    <ThemeProvider theme={theme}>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                      >
                        Min
                      </Button>
                    </ThemeProvider>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" className={classes.button}>
                      {obj.stat.min}
                    </Button>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem button>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item>
                    <Histogram
                      width={500}
                      height={300}
                      ariaLabel="My histogram of quiz score"
                      orientation="vertical"
                      cumulative={false}
                      normalized={false}
                      binCount={20}
                      valueAccessor={(datum) => datum}
                      binType="numeric"
                      renderTooltip={({ event, datum, data, color }) => (
                        <div>
                          <strong style={{ color }}>
                            {datum.bin0} to {datum.bin1}
                          </strong>
                          <div>
                            <strong>count </strong>
                            {datum.count}
                          </div>
                          <div>
                            <strong>cumulative </strong>
                            {datum.cumulative}
                          </div>
                        </div>
                      )}
                    >
                      <BarSeries animated rawData={obj.score_data} />
                      <XAxis />
                      <YAxis />
                    </Histogram>
                  </Grid>
                </Grid>
              </ListItem>
            </List>
            <List
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Items Analyze
                </ListSubheader>
              }
              className={classes.root}
            >
              
              {obj.score
                ? obj.score.map((qType) => {
                    return (
                      <React.Fragment>
                        <React.Fragment>
                          <ListItem button>
                            <Grid
                              container
                              direction="row"
                              justify="center"
                              alignItems="center"
                              spacing={2}
                            >
                              <Grid item>
                                <ThemeProvider theme={theme}>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    style={{ width: 10 }}
                                  >
                                    {`*`}
                                  </Button>
                                </ThemeProvider>
                              </Grid>

                              <Grid item>
                                <ThemeProvider theme={theme}>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                  >
                                    Correct
                                  </Button>
                                </ThemeProvider>
                              </Grid>
                              <Grid item>
                                <ThemeProvider theme={theme}>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                  >
                                    %
                                  </Button>
                                </ThemeProvider>
                              </Grid>
                            </Grid>
                          </ListItem>
                        </React.Fragment>
                        {qType.map((obj2) => {
                          let data = obj2.count;
                          return (
                            <React.Fragment key={obj2.question}>
                              <ListItem button onClick={handleClick}>
                                <Grid
                                  container
                                  direction="row"
                                  justify="center"
                                  alignItems="center"
                                  spacing={2}
                                >
                                  <Grid item>
                                    <Button
                                      variant="contained"
                                      style={{ width: 10 }}
                                    >
                                      {obj2.question}
                                    </Button>
                                  </Grid>
                                  <Grid item>
                                    <Button
                                      variant="contained"
                                      className={classes.button}
                                    >
                                      {`${obj2.correct} / ${obj.total}`}
                                    </Button>
                                  </Grid>
                                  <Grid item>
                                    <Button
                                      variant="contained"
                                      className={classes.button}
                                    >
                                      {`${(
                                        (obj2.correct / obj.total) *
                                        100
                                      ).toFixed(2)}%`}
                                    </Button>
                                  </Grid>
                                </Grid>
                              </ListItem>
                              <Collapse in={open} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                  <ListItem button className={classes.nested}>
                                    <Grid
                                      container
                                      direction="column"
                                      justify="center"
                                      alignItems="center"
                                    >
                                      <Grid item>
                                        <RadialChart
                                          ariaLabel="This is a radial-chart chart of..."
                                          width={500}
                                          height={500}
                                          margin={{
                                            top: 10,
                                            right: 10,
                                            bottom: 10,
                                            left: 10,
                                          }}
                                          renderTooltip={({
                                            datum,

                                            fraction,
                                          }) => (
                                            <div>
                                              <strong>{datum.label}</strong>{" "}
                                              {datum.value} (
                                              {(fraction * 100).toFixed(2)}%)
                                            </div>
                                          )}
                                        >
                                          <ArcSeries
                                            data={data}
                                            pieValue={(d) => d.value}
                                            fill={(arc) =>
                                              colorScale(arc.data.label)
                                            }
                                            stroke="#fff"
                                            strokeWidth={1}
                                            label={(arc) =>
                                              arc.data.value > 1
                                                ? `${arc.data.value} students`
                                                : `${arc.data.value} student`
                                            }
                                            labelComponent={<ArcLabel />}
                                            innerRadius={(radius) =>
                                              0.35 * radius
                                            }
                                            outerRadius={(radius) =>
                                              0.6 * radius
                                            }
                                            labelRadius={(radius) =>
                                              0.75 * radius
                                            }
                                          />
                                        </RadialChart>
                                      </Grid>
                                      <Grid item>
                                        <LegendOrdinal
                                          direction="row"
                                          scale={colorScale}
                                          shape="rect"
                                          fill={({ datum }) =>
                                            colorScale(datum)
                                          }
                                          labelFormat={(label) =>
                                            `Choice: ${label}`
                                          }
                                        />
                                      </Grid>
                                    </Grid>
                                  </ListItem>
                                </List>
                              </Collapse>
                            </React.Fragment>
                          );
                        })}
                      </React.Fragment>
                    );
                  })
                : null}
            </List>
          </div>
        ))
      ) : (
        <LinearProgress />
      )}
    </Paper>
  );
};
StatIndex.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StatIndex);
