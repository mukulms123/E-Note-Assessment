import React from "react";
import {Route, Redirect} from "react-router-dom";
import {isAuthenticated} from "../auth/helper/auth";

const AuthenticatedRoute = ({component: Component, ...rest}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() ? <Component {...props} /> : <Redirect to="/signin" />
      }
    />
  );
};

export default AuthenticatedRoute;
