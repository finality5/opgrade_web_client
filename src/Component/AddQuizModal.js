import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";

import AddIcon from "@material-ui/icons/Add";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

import DialogTitle from "@material-ui/core/DialogTitle";
import axios from "axios";
import { AppContext } from "./../context/context";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";

import MenuItem from "@material-ui/core/MenuItem";

import FormControl from "@material-ui/core/FormControl";

import Ans1 from "./../image/ans1.png";
import Ans2 from "./../image/ans2.png";
import { Typography } from "@material-ui/core";

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
  formControl: {
    width: "100%",
    minWidth: 120,
  },
}));

export default function TransitionsModal() {
  const classes = useStyles();
  const { user, host, ticker, setTicker, current } = useContext(AppContext);
  const [open, setOpen] = useState(false);

  const [Err, setErr] = useState({ error: "" });
  const [openModal, setOpenModal] = useState(false);
  const [sheet, setSheet] = useState("");

  const handleChange = (event) => {
    setSheet(event.target.value);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSheet("");
  };

  const modalClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenModal(false);
  };

  const addQuiz = (event) => {
    event.preventDefault();
    const { quiz_name } = event.target.elements;
    if (!quiz_name.value) {
      alert("Quiz Name is required");
      return setErr({ error: "Class Name is required" });
    }

    if (sheet === "") {
      alert("Answer Sheet is required");
      return setErr({ error: "Answer Sheet is required" });
    }
    //console.log(quiz_name.value, class_id.value,sheet);
    const url = `http://${host}:5000/addquiz`;
    const payload = {
      uid: user.uid,
      quiz_name: quiz_name.value,
      class_key: current.class_key,
      quiz_type: String(sheet),
    };
    axios
      .post(url, payload)
      .then((res) => {
        setOpen(false);
        setOpenModal(true);
        setTicker(!ticker);
        //console.log(res);
      })
      .catch((err) => setErr({ error: err.message }));
  };

  if (Err.error) console.log(">>>>", Err.error);

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        className={classes.addUser}
        endIcon={<AddIcon />}
        onClick={handleOpen}
      >
        Add Quiz
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
            <Grid item>Add Quiz</Grid>
            <Grid item>
              <AddIcon style={{ marginTop: 8 }} />
            </Grid>
          </Grid>
        </DialogTitle>
        <form noValidate onSubmit={addQuiz}>
          <DialogContent
            className={classes.paper}
            style={{ paddingTop: 0, marginTop: 0 }}
          >
            <TextField
              required
              autoFocus
              margin="dense"
              id="quiz_name"
              label="Quiz Name"
              type="text"
              fullWidth
            />

            <FormControl className={classes.formControl}>
              <TextField
                required
                id="standard-select-currency"
                select
                label="Answer Sheet"
                value={sheet}
                onChange={handleChange}
                helperText={sheet === "" ? "Please select answer sheet" : null}
              >
                <MenuItem value={0}>
                  <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                    spacing={2}
                  >
                    <Grid item>
                      <img src={Ans1} width={50} alt="Logo" />
                    </Grid>
                    <Grid>
                      <Typography>50 questions multiple-choice</Typography>
                    </Grid>
                  </Grid>
                </MenuItem>
                <MenuItem value={1}>
                  <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                    spacing={2}
                  >
                    <Grid item>
                      <img src={Ans2} width={50} alt="Logo" />
                    </Grid>
                    <Grid>
                      <Typography>40 questions multiple-choice</Typography>
                    </Grid>
                  </Grid>
                </MenuItem>
              </TextField>
            </FormControl>
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
