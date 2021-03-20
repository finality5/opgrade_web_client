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
import { Typography } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

import FormControl from "@material-ui/core/FormControl";
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
  imageBox: {
    padding: 20,
  },
  formControl: {
    width: 500,
    minWidth: 120,
  },
}));

export default function TransitionsModal({ isTicker, setTicker }) {
  const classes = useStyles();
  const { user, host, ticker, current, currentQuiz } = useContext(AppContext);
  const [open, setOpen] = useState(false);

  const [upload, setUpload] = useState(false);
  const [isFetch, setFetch] = useState();
  const [startFetch, setStart] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [sheet, setSheet] = useState("");
  const [file, setFile] = useState([]);
  const url = `http://${host}:5000/scan_image`;
  const handleDelete = (chipToDelete) => () => {
    //console.log(chipToDelete);
    setFile((chips) => chips.filter((chip) => chip.preview !== chipToDelete));
  };

  const handleChange = (event) => {
    setSheet(event.target.value);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFile([]);
    setSheet()
  };

  const modalClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenModal(false);
  };

  console.log(currentQuiz);
  const addStudent = async (event) => {
    setStart(true);
    event.preventDefault();

    if (file.length === 0) {
      return alert("File is required, make sure that you have uploaded file.");
    }
    for (let i = 0; i < file.length; i++) {
      setUpload(true);
      const post = await fetchPosts(i);
      console.log(post);
      setUpload(false);
      setFetch();
    }
    setFile([]);
    setStart(false);
    setOpen(false);
    setOpenModal(true);
    setSheet()
    setTicker(!isTicker);
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
  //console.log(file);

  const fetchPosts = async (i) => {
    setFetch(file[i].preview);
    let req = new FormData();
    req.append("image", file[i].file);
    try {
      const data = await axios.post(url, req);
      return data.data;
    } catch (error) {
      console.log(error);
    }
  };

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
              width: 570,
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
                {file.length === 0 ? (
                  <label htmlFor="contained-button-file">
                    <Tooltip title="Choose image file">
                      <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        endIcon={<CloudUploadIcon />}
                      >
                        Upload Images
                      </Button>
                    </Tooltip>
                  </label>
                ) : (
                  <FormControl className={classes.formControl}>
                    <TextField
                      required
                      id="standard-select-currency"
                      select
                      label="Answer Sheet"
                      value={sheet}
                      onChange={handleChange}
                      helperText={
                        sheet === "" ? "Please select answer sheet" : null
                      }
                    >
                      {Object.entries(currentQuiz.quizAnswer).map(
                        ([key, value]) => (
                          <MenuItem value={key} key={key}>
                            <Grid
                              container
                              direction="row"
                              justify="flex-start"
                              alignItems="center"
                              spacing={3}
                            >
                              <Grid item>
                                <img
                                  src={value.answer_url}
                                  width={50}
                                  alt="Logo"
                                />
                              </Grid>
                              <Grid>
                                <Typography>{value.answer_name}</Typography>
                              </Grid>
                            </Grid>
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  </FormControl>
                )}
              </Grid>
            </Grid>
            <div className={classes.imageBox}>
              <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                spacing={2}
              >
                {file
                  ? file.map((obj) => (
                      <Grid item key={obj.preview}>
                        <Grid
                          container
                          direction="column"
                          justify="center"
                          alignItems="center"
                        >
                          <Grid item>
                            <img src={obj.preview} alt="images" width={150} />
                            {upload && isFetch === obj.preview ? (
                              <LinearProgress />
                            ) : null}
                          </Grid>
                          <Grid item>
                            <Button size="small" color="primary">
                              {obj.name}
                            </Button>
                            {!startFetch ? (
                              <IconButton
                                color="primary"
                                aria-label="delete"
                                onClick={handleDelete(obj.preview)}
                              >
                                <DeleteIcon style={{ width: 20 }} />
                              </IconButton>
                            ) : null}
                          </Grid>
                        </Grid>
                      </Grid>
                    ))
                  : null}
              </Grid>
            </div>
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
