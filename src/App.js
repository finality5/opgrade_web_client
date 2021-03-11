import React from "react";
import "./App.css";
import Paperbase from "./Paperbase";
import Login from "./Component/Login";
import SignUp from "./Component/SignUp";
import PrivateRoute from "./PrivateRoute";
import { HashRouter as Router, Route } from "react-router-dom";
//import { Container, Header, Menu, Icon } from "semantic-ui-react";
//import Speech from "./Components/Speech";
import { AuthProvider } from "./Auth";
import { AppProvider } from "./context/context";
function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <Router>
          <div>
            <PrivateRoute exact path="/main" component={Paperbase} />
            <Route exact path="/" component={Login} />
            <Route exact path="/signup" component={SignUp} />
          </div>
        </Router>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
