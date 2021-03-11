import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";

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
  },
  item: {
    paddingTop: 1,
    paddingBottom: 1,
    color: "rgba(255, 255, 255, 0.7)",
    "&:hover,&:focus": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
  },
  itemCategory: {
    backgroundColor: "#232f3e",
    boxShadow: "0 -1px 0 #404854 inset",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    cursor: "pointer",
  },
  itemSecondary: {
    fontSize: "inherit",
  },
  itemIcon: {
    minWidth: "auto",
    marginRight: theme.spacing(2),
  },
}));

export default function TransitionsModal() {
  const classes = useStyles();
  const { user, host } = useContext(AppContext);
  const [open, setOpen] = useState(false);
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

  const addClass = (event) => {
    event.preventDefault();
    const { class_name, class_id } = event.target.elements;
    if (!class_name.value) {
      alert("Class Name is required");
      return setErr({ error: "Class Name is required" });
    }
    if (!class_id.value) {
      alert("Class ID is required");
      return setErr({ error: "Class ID is required" });
    }
    console.log(class_name.value, class_id.value);
    const url = `http://${host}:5000/addclass`;
    const payload = {
      uid: user.uid,
      class_name: class_name.value,
      class_id: class_id.value,
    };
    axios
      .post(url, payload)
      .then((res) => {
        setOpen(false);
        setOpenModal(true);
        console.log(res);
      })
      .catch((err) => setErr({ error: err.message }));
  };

  if (Err.error) console.log(">>>>", Err.error);

  return (
    <div>
      <ListItem
        className={clsx(classes.item, classes.itemCategory)}
        onClick={handleOpen}
      >
        <ListItemIcon className={classes.itemIcon}>
          <AddIcon />
        </ListItemIcon>
        <ListItemText
          classes={{
            primary: classes.itemSecondary,
          }}
        >
          Add Class
        </ListItemText>
      </ListItem>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Class</DialogTitle>
        <form noValidate onSubmit={addClass}>
          <DialogContent className={classes.paper}>
            <TextField
              required
              autoFocus
              margin="dense"
              id="class_name"
              label="Class Name"
              type="text"
              fullWidth
            />
            <TextField
              required
              autoFocus
              margin="dense"
              id="class_id"
              label="Class Id"
              type="text"
              fullWidth
            />
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
