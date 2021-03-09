import React, { useContext, useState, useEffect, useCallback } from "react";
import { withRouter, Redirect } from "react-router";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import "./../Style/Login.css";
import firebase from "../FirebaseAPI";
import { AuthContext } from "./../Auth";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  header: {
    fontWeight: "bold",
    marginBottom: 20,
  },
}));

export default function SignIn({ history }) {
  const { currentUser } = useContext(AuthContext);
  const [Firebaseload, setFirebaseload] = useState({ loading: true });
  const [Load, setLoad] = useState({ loading: false });
  const [Err, setErr] = useState({ error: "" });
  const classes = useStyles();

  useEffect(() => {
    let isSubscribed = true;
    firebase.auth().onAuthStateChanged(() => {
      if (isSubscribed) {
        setFirebaseload({ loading: false });
      }
    });
    return () => (isSubscribed = false);
  }, []);

  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      setLoad({ loading: true });
      const { email, password } = event.target.elements;
      if (!email.value) {
        setLoad({ loading: false });
        return setErr({ error: "Email is required" });
      }
      if (!password.value) {
        setLoad({ loading: false });
        return setErr({ error: "Password is required" });
      }
      try {
        await firebase
          .auth()
          .signInWithEmailAndPassword(email.value, password.value)
          .then(() => {
            setLoad({ loading: false });
            history.push("/main");
          });
      } catch (err) {
        setLoad({ loading: false });
        setErr({ error: err.message });
      }
    },
    [history]
  );

  if (currentUser) {
    return <Redirect to="/main" />;
  }

  if (Firebaseload.loading) {
    return <div className="area"></div>;
  }

  return (
    <div className="area">
      <Container component="main" maxWidth="xs" className="box">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" className={classes.header}>
            Sign in
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleLogin}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
      <ul className="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  );
}
