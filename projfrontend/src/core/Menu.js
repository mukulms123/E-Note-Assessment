import React from "react";
import {Navbar, Nav} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import {isAuthenticated} from "./helper/auth";

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
        <Nav.Link href="/">
          <div className={currentTab(history, "/")}>Home</div>
        </Nav.Link>
        <Nav.Link href="/signin">
          <div className={currentTab(history, "/signin")}>Signin</div>
        </Nav.Link>
        <Nav.Link href="/signup">
          <div className={currentTab(history, "/signup")}>Signup</div>
        </Nav.Link>
      </Nav>
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>
          {isAuthenticated() ? (
            <div>
              Signed in as: <a href="#login">{isAuthenticated().user.name}</a>
            </div>
          ) : (
            <div className="text-warning">Not Singed in</div>
          )}
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Menu;
