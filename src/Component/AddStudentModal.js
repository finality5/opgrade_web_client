import React, { useState, useContext } from "react";
import {
  makeStyles,
  ThemeProvider,
  createMuiTheme,
  withStyles,
} from "@material-ui/core/styles";

import AddIcon from "@material-ui/icons/Add";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

import DialogTitle from "@material-ui/core/DialogTitle";

import { AppContext } from "./../context/context";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import AccountCircle from "@material-ui/icons/AccountCircle";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import InputAdornment from "@material-ui/core/InputAdornment";
import Switch from "@material-ui/core/Switch";
import { green, red } from "@material-ui/core/colors";

import Tooltip from "@material-ui/core/Tooltip";
import * as XLSX from "xlsx";
import Chip from "@material-ui/core/Chip";

import Avatar from "@material-ui/core/Avatar";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import RefreshIcon from "@material-ui/icons/Refresh";
import LinearProgress from '@material-ui/core/LinearProgress';

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
  chip: {
    margin: theme.spacing(0.5),
  },
  listContainer: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
}));

const AntSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    "&$checked": {
      transform: "translateX(12px)",
      color: theme.palette.common.white,
      "& + $track": {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: "none",
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch);

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
  const [isToggle, setToggle] = useState(false);
  const [items, setItems] = useState([]);
  const [isFetch, setFetch] = useState(false);

  const handleDelete = (chipToDelete) => () => {
    setItems((chips) => chips.filter((chip) => chip.id !== chipToDelete.id));
  };
  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
        console.log("#", error.message);
        setItems([]);
      };
    });

    promise
      .then((d) => {
        let data = d.filter(
          (obj) => idChecker(String(obj.id)) && obj.firstname && obj.lastname
        );
        setItems(data);
        //console.log("# Success reading xlsx");
      })
      .catch((e) => {
        console.log(e.message);
        setItems([]);
      });
  };
  //console.log(items);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setItems([]);
    setId("");
    setToggle(false);
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
    if (!isToggle) {
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
      //   console.log(
      //     student_id.value,
      //     firstname.value,
      //     lastname.value,
      //     current.class_key
      //   );
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
          setTicker(!ticker);
          //console.log("#", res);
        })
        .catch((err) => setErr({ error: err.message }));
    } else {
      if (items.length === 0) {
        return alert(
          "File is required, make sure that you have uploaded file."
        );
      }
      setFetch(true);
      let tmp = [];
      items.forEach((obj) => {
        tmp.push({
          student_id: String(obj.id),
          student_name: `${obj.firstname} ${obj.lastname}`,
        });
      });
      const url = `http://${host}:5000/addstudent`;
      const payload = {
        uid: user.uid,
        class_key: current.class_key,
        student: tmp,
      };
      //console.log(tmp);
      axios
        .post(url, payload)
        .then((res) => {
          setOpen(false);
          setOpenModal(true);
          setTicker(!ticker);
          setFetch(false);
          //console.log("#", res);
        })
        .catch((err) => {
          setFetch(false);
          setErr({ error: err.message });
        });
    }
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
        <DialogTitle id="form-dialog-title">
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
            spacing={1}
          >
            <Grid item>Add Student</Grid>
            <Grid item>
              <AntSwitch
                checked={isToggle}
                onChange={() => setToggle(!isToggle)}
              />
            </Grid>
          </Grid>
          {isFetch?<LinearProgress style={{marginTop:10}} />:null}
        </DialogTitle>
        <form noValidate onSubmit={addStudent}>
          {!isToggle ? (
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
          ) : (
            <DialogContent
              style={{
                width: 454,
                minHeight: 145,
                paddingTop: 0,
                marginTop: 0,
              }}
            >
              <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ marginTop: "10%" }}
              >
                <Grid item>
                  <input
                    accept=".xlsx"
                    style={{ display: "none" }}
                    id="contained-button-file"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      readExcel(file);
                    }}
                  />
                  <label htmlFor="contained-button-file">
                    <Tooltip
                      title="Make sure that your file respectively contains 3 rows of student's id,
                    firstname and lastname with header (id,firstname,lastname)"
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        endIcon={
                          items.length === 0 ? (
                            <CloudUploadIcon />
                          ) : (
                            <RefreshIcon />
                          )
                        }
                      >
                        Upload Excel
                      </Button>
                    </Tooltip>
                  </label>
                </Grid>
              </Grid>
              {items ? (
                <div className={classes.listContainer}>
                  {items.map((data) => {
                    return (
                      <li key={data.id}>
                        <Tooltip
                          title={`${data.id} ${data.firstname} ${data.lastname}`}
                        >
                          <Chip
                            variant="outlined"
                            avatar={<Avatar>{data.firstname[0]}</Avatar>}
                            label={`${data.id}`}
                            color="primary"
                            clickable
                            onDelete={handleDelete(data)}
                            className={classes.chip}
                          />
                        </Tooltip>
                      </li>
                    );
                  })}
                </div>
              ) : null}
            </DialogContent>
          )}
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
