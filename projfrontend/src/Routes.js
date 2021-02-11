import React from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import {authenticate} from "./auth/helper/auth";
import Home from "./core/Home";
import Signin from "./auth/Signin";
import Note from "./core/Note";
import Signup from "./auth/Signup";
import AuthenticatedRoute from "./helper/AuthenticatedRoute";
import Edit from "./core/Edit";
import User from "./user/User";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <AuthenticatedRoute path="/" exact component={Home} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/signin" exact component={Signin} />
        <AuthenticatedRoute path="/note/:id" exact component={Note} />
        <AuthenticatedRoute path="/note/update/:id" exact component={Edit} />
        <AuthenticatedRoute path="/user/:id/dashboard" exct component={User} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
