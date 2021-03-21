import React, { useContext, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { AppContext } from "./../context/context";
import Axios from "axios";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";

import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";

import { scaleOrdinal } from "@vx/scale";
import { LegendOrdinal } from "@vx/legend";

import { color as colors } from "@data-ui/theme";
import { RadialChart, ArcSeries, ArcLabel } from "@data-ui/radial-chart";

const colorScale = scaleOrdinal({
  range: ["#00c7c7ff", "#4a86e8ff", "#674ea7ff", "#0b5394ff"],
});
const data = [
  { label: "a", value: 20 },
  { label: "b", value: 40 },
  { label: "c", value: 30 },
  { label: "d", value: 10 },
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

const StatIndex = (props) => {
  const { classes } = props;
  const { setUser, host, current, user, mode } = useContext(AppContext);
  const [student, setStudent] = useState([]);
  const [open, setOpen] = React.useState(true);

  console.log(colorScale);
  const handleClick = () => {
    setOpen(!open);
  };
  useEffect(() => {
    if (current) {
      const url = `http://${host}:5000/getstudent?uid=${user.uid}&class_key=${current.class_key}`;
      Axios.get(url).then((res) => {
        if (res.data.student_data) {
          let data = [];
          res.data.student_data.forEach((obj) => {
            //console.log(obj.student_name.split(" "));
            data.push({
              id: obj.student_id,
              lastName: obj.student_name.split(" ")[1],
              firstName: obj.student_name.split(" ")[0],
            });
          });
          setStudent(data);
        }
      });
    }
  }, [current, user]);

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
      <div className={classes.contentWrapper}>
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Nested List Items
            </ListSubheader>
          }
          className={classes.root}
        >
          <ListItem button onClick={handleClick}>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <Button variant="contained" style={{ width: 10 }}>
                  1
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" className={classes.button}>
                  Correct
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" className={classes.button}>
                  %
                </Button>
              </Grid>
            </Grid>
            {open ? <ExpandLess /> : <ExpandMore />}
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
                      margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                      renderTooltip={({ event, datum, data, fraction }) => (
                        <div>
                          <strong>{datum.label}</strong>{ ' '}
                          {datum.value} ({(fraction * 100).toFixed(2)}%)
                        </div>
                      )}
                    >
                      <ArcSeries
                        data={data}
                        pieValue={(d) => d.value}
                        fill={(arc) => colorScale(arc.data.label)}
                        stroke="#fff"
                        strokeWidth={1}
                        label={(arc) => `${arc.data.value.toFixed(1)}%`}
                        labelComponent={<ArcLabel />}
                        innerRadius={(radius) => 0.35 * radius}
                        outerRadius={(radius) => 0.6 * radius}
                        labelRadius={(radius) => 0.75 * radius}
                      />
                    </RadialChart>
                  </Grid>
                  <Grid item>
                    <LegendOrdinal
                      direction="row"
                      scale={colorScale}
                      shape="rect"
                      fill={({ datum }) => colorScale(datum)}
                      labelFormat={(label) => label}
                    />
                  </Grid>
                </Grid>
              </ListItem>
            </List>
          </Collapse>
        </List>
      </div>
    </Paper>
  );
};
StatIndex.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StatIndex);
