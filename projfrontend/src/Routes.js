import React from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import {authenticate} from "./core/helper/auth";
import Home from "./core/Home";
import Signin from "./core/Signin";
import Signup from "./core/Signup";
import AuthenticatedRoute from "./helper/AuthenticatedRoute";
const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <AuthenticatedRoute path="/" exact component={Home} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/signin" exact component={Signin} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
