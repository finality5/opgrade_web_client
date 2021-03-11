import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import AddStudentModal from "./AddStudentModal";
import { DataGrid } from "@material-ui/data-grid";
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

const columns = [
  {
    field: "id",
    headerName: "Student ID",
    description: "This column displays student's ID",
    width: 120,
  },
  {
    field: "firstName",
    headerName: "First name",
    description: "This column displays student's firstname.",
    width: 180,
  },
  {
    field: "lastName",
    headerName: "Last name",
    description: "This column displays student's lastname.",
    width: 180,
  },

  //   {
  //     field: "fullName",
  //     headerName: "Full name",
  //     description: "This column has a value getter and is not sortable.",
  //     sortable: false,
  //     width: 160,
  //     valueGetter: (params) =>
  //       `${params.getValue("firstName") || ""} ${
  //         params.getValue("lastName") || ""
  //       }`,
  //   },
];



const StudentIndex = (props) => {
  const { classes } = props;
  const { setUser, host, current, user, mode } = useContext(AppContext);
  const [student, setStudent] = useState([]);
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
  }, [current,user]);
  //console.log(student);
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
            <Grid item>
              <AddStudentModal />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <div className={classes.contentWrapper}>
        <Grid container direction="column" justify="center" alignItems="center">
          <Grid item xs={8} style={{ height: 400, width: "100%" }}>
            <DataGrid
              autoHeight={true}
              rowHeight={48}
              rows={student}
              columns={columns}
              pageSize={8}
            />
          </Grid>
        </Grid>
      </div>
    </Paper>
  );
};
StudentIndex.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StudentIndex);
