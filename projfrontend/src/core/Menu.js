import React, {Fragment} from "react";
import {Navbar, Nav} from "react-bootstrap";
import {useHistory, Redirect} from "react-router-dom";
import {isAuthenticated, signout} from "../auth/helper/auth";

const currentTab = (history, path) => {
  if (history.location.pathname === path) {
    return "text-white";
  } else {
    return "";
  }
};

const user = isAuthenticated() && isAuthenticated().user;
const token = isAuthenticated() && isAuthenticated().token;

const Menu = () => {
  var history = useHistory();
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="/">E-note</Navbar.Brand>
      <Navbar.Toggle />
      <Nav className="mr-auto">
        {!isAuthenticated() && (
          <Fragment>
            <Nav.Link href="/signin">
              <div className={currentTab(history, "/signin")}>Signin</div>
            </Nav.Link>
            <Nav.Link href="/signup">
              <div className={currentTab(history, "/signup")}>Signup</div>
            </Nav.Link>
          </Fragment>
        )}
        {isAuthenticated() && (
          <Fragment>
            <Nav.Link href="/">
              <div className={currentTab(history, "/")}>Home</div>
            </Nav.Link>
            <Nav.Link
              href="/signin"
              onClick={() => {
                signout(() => {
                  <Redirect to="/signin" />;
                });
              }}
            >
              <div className="text-danger">Signout</div>
            </Nav.Link>
          </Fragment>
        )}
      </Nav>
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>
          {isAuthenticated() ? (
            <Fragment>
              <span
                tabindex="0"
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                title="Dashboard"
              >
                Signed in as:{" "}
                <a href={`/user/${user._id}/dashboard`}>
                  {isAuthenticated().user.name}
                </a>
              </span>
            </Fragment>
          ) : (
            <Fragment>
              <div className="text-warning">Not Singed in</div>
            </Fragment>
          )}
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Menu;
