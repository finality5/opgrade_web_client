import React, { useState, useContext } from "react";
import {
  makeStyles,
  ThemeProvider,
  createMuiTheme,
} from "@material-ui/core/styles";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AddIcon from "@material-ui/icons/Add";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Axios from "axios";
import { AppContext } from "./../context/context";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import AccountCircle from "@material-ui/icons/AccountCircle";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import InputAdornment from "@material-ui/core/InputAdornment";
import { green, red } from "@material-ui/core/colors";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    width: "100%",
    marginTop: 0,
  },

  addUser: {
    marginRight: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
}));

const idChecker = (id) => {
  let check = false;
  if (id.match(/^$|^\d{5}$/)) check = true;
  return check;
};

export default function TransitionsModal() {
  const classes = useStyles();
  const { user, host, ticker, setTicker, current } = useContext(AppContext);
  const [open, setOpen] = useState(false);

  const [studentId, setId] = useState("");
  const [Err, setErr] = useState({ error: "" });
  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const modalClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenModal(false);
  };

  const theme = createMuiTheme({
    palette: {
      primary: idChecker(studentId) ? green : red,
    },
  });

  const addStudent = (event) => {
    event.preventDefault();
    const { student_id, firstname, lastname } = event.target.elements;
    if (!student_id.value) {
      alert("Student ID is required");
      return setErr({ error: "Student ID is required" });
    }
    if (!firstname.value) {
      alert("First Name is required");
      return setErr({ error: "First Name is required" });
    }
    if (!lastname.value) {
      alert("Last Name is required");
      return setErr({ error: "Last Name is required" });
    }
    if (!idChecker(student_id.value)) {
      alert("Student ID doesn't match with pattern");
      return setErr({ error: "Student ID doesn't match with pattern" });
    }
    //console.log(student_id.value, firstname.value, lastname.value,current.class_key);
    const url = `http://${host}:5000/addstudent`;
    const payload = {
      uid: user.uid,
      class_key: current.class_key,
      student: [
        {
          student_id: student_id.value,
          student_name: `${firstname.value} ${lastname.value}`,
        },
      ],
    };

    axios
      .post(url, payload)
      .then((res) => {
        setOpen(false);
        setOpenModal(true);
        setTicker(!ticker)
        //console.log("#", res);
      })
      .catch((err) => setErr({ error: err.message }));
  };

  //if (Err.error) console.log(">>>>", Err.error);
  
  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        className={classes.addUser}
        endIcon={<AddIcon />}
        onClick={handleOpen}
      >
        Add Student
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Student</DialogTitle>
        <form noValidate onSubmit={addStudent}>
          <DialogContent
            className={classes.paper}
            style={{ paddingTop: 0, marginTop: 0 }}
          >
            <ThemeProvider theme={theme}>
              <TextField
                error={idChecker(studentId) ? false : true}
                value={studentId}
                onChange={(e) => setId(e.target.value)}
                required
                autoFocus
                margin="dense"
                id="student_id"
                label="Student Id"
                type="text"
                fullWidth
                helperText="5-digit numbers"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKeyIcon
                        style={{
                          color:
                            idChecker(studentId) && studentId !== ""
                              ? green[500]
                              : !idChecker(studentId) && studentId !== ""
                              ? red[500]
                              : "#000",
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </ThemeProvider>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="flex-end"
              spacing={1}
            >
              <Grid item>
                <AccountCircle />
              </Grid>
              <Grid item>
                <TextField
                  required
                  autoFocus
                  margin="dense"
                  id="firstname"
                  label="First Name"
                  type="text"
                  fullWidth
                />
              </Grid>

              <Grid item>
                <AccountCircle />
              </Grid>
              <Grid item>
                <TextField
                  required
                  autoFocus
                  margin="dense"
                  id="lastname"
                  label="Last Name"
                  type="text"
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar open={openModal} autoHideDuration={2000} onClose={modalClose}>
        <Alert onClose={modalClose} severity="success">
          Successfully update class
        </Alert>
      </Snackbar>
    </div>
  );
}
