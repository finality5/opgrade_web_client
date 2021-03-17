import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";

import AddIcon from "@material-ui/icons/Add";

import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

import DialogTitle from "@material-ui/core/DialogTitle";

import { AppContext } from "./../context/context";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";

import Tooltip from "@material-ui/core/Tooltip";

import Chip from "@material-ui/core/Chip";

import Avatar from "@material-ui/core/Avatar";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import RefreshIcon from "@material-ui/icons/Refresh";

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

export default function TransitionsModal() {
  const classes = useStyles();
  const { user, host, ticker, setTicker, current } = useContext(AppContext);
  const [open, setOpen] = useState(false);

  const [studentId, setId] = useState("");
  const [Err, setErr] = useState({ error: "" });
  const [openModal, setOpenModal] = useState(false);

  const [items, setItems] = useState([]);
  const [file, setFile] = useState([]);
  const handleDelete = (chipToDelete) => () => {
    setItems((chips) => chips.filter((chip) => chip.id !== chipToDelete.id));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setItems([]);
    setId("");
  };

  const modalClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenModal(false);
  };

  const addStudent = (event) => {
    event.preventDefault();

    if (items.length === 0) {
      return alert("File is required, make sure that you have uploaded file.");
    }
  };

  const uploadMultipleFiles = (e) => {
    //let fileObj = [];
    let fileArray = [];
    let fileObj = e.target.files;
    for (let i = 0; i < fileObj.length; i++) {
      fileArray.push({
        preview: URL.createObjectURL(fileObj[i]),
        name: fileObj[i].name,
        file: fileObj[i],
      });
    }
    setFile(fileArray);
    
  };
  //if (Err.error) console.log(">>>>", Err.error);
  console.log(file);

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        className={classes.addUser}
        endIcon={<AddIcon />}
        onClick={handleOpen}
      >
        Grading Images
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
            <Grid item>Grading Images</Grid>
          </Grid>
        </DialogTitle>
        <form noValidate onSubmit={addStudent}>
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
                  accept="image/*"
                  style={{ display: "none" }}
                  id="contained-button-file"
                  type="file"
                  onChange={(e) => {
                    uploadMultipleFiles(e);
                  }}
                  multiple
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
                      Upload Images
                    </Button>
                  </Tooltip>
                </label>
              </Grid>
            </Grid>
            <div>
              {file
                ? file.map((obj) => (
                    <img key={obj.preview} src={obj.preview} alt="images" width={50} />
                  ))
                : null}
            </div>
            {/* {items ? (
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
            ) : null} */}
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
