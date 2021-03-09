import React, { useCallback, useState, useContext, useEffect } from "react";
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
import PersonIcon from "@material-ui/icons/Person";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import "./../Style/Login.css";
import firebase from "../FirebaseAPI";
import { AuthContext } from "./../Auth";
import { signInUser } from "./../api/auth-api";

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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  header: {
    fontWeight: "bold",
    marginBottom: 20,
  },
}));

export default function SignUp({ history }) {
  const classes = useStyles();
  const { currentUser } = useContext(AuthContext);
  const [sign, setSign] = useState({ signed: false });
  const [Load, setLoad] = useState({ loading: false });
  const [Err, setErr] = useState({ error: "" });
  const [Firebaseload, setFirebaseload] = useState({ loading: true });

  useEffect(() => {
    let isSubscribed = true;
    firebase.auth().onAuthStateChanged(() => {
      if (isSubscribed) {
        setFirebaseload({ loading: false });
      }
    });
    return () => (isSubscribed = false);
  }, []);

  const handleRegister = useCallback(
    async (event) => {
      event.preventDefault();
      setLoad({ loading: true });
      const {
        email,
        password,
        cpassword,
        firstName,
        lastName,
      } = event.target.elements;
      if (!email.value) {
        setLoad({ loading: false });
        return setErr({ error: "Username is required" });
      }
      if (!password.value) {
        setLoad({ loading: false });
        return setErr({ error: "Email is required" });
      }

      if (!firstName.value) {
        setLoad({ loading: false });
        return setErr({ error: "Password is required" });
      }
      if (!lastName.value) {
        setLoad({ loading: false });
        return setErr({ error: "Confirm password is required" });
      }
      if (password.value !== cpassword.value) {
        setLoad({ loading: false });
        return setErr({
          error: "Your password and confirm password don't match",
        });
      }
      const name = `${firstName.value} ${lastName.value}`;

      const response = await signInUser({
        name: name,
        email: email.value,
        password: password.value,
      });
      if (response.error) {
        setErr({ error: response.error });
      }
      setLoad(false);
      setSign({ signed: true });
      console.log("Success Sign up");
    },
    [history]
  );

  if (currentUser && !sign.signed) {
    return <Redirect to="/main" />;
  }
  return (
    <div className="area">
      <Container component="main" maxWidth="xs" className="box">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <PersonIcon />
          </Avatar>
          <Typography component="h1" variant="h5" className={classes.header}>
            Sign up
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleRegister}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="cpassword"
                  label="Confirm Password"
                  type="password"
                  id="cpassword"
                  autoComplete="current-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign Up
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
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
