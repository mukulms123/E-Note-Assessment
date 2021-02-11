import React, {useState} from "react";
import Base from "../core/Base";
import {Form, Button, Alert} from "react-bootstrap";
import {signup, isAuthenticated, authenticate} from "./helper/auth";
import {Redirect} from "react-router-dom";

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    error: "",
    redirect: false,
  });
  const {name, lastname, email, password, error, redirect} = values;
  const handleChange = (name) => (event) => {
    setValues({...values, error: false, [name]: event.target.value});
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({...values, error: false});
    signup({name, lastname, email, password}).then((data) => {
      if (data.error) {
        setValues({...values, error: data.error, redirect: false});
      } else {
        setValues({...values, error: false, redirect: true});
      }
    });
  };

  const signupForm = () => {
    return (
      <Form>
        <div className="row">
          <div className="col-6">
            <Form.Group controlId="formBasicEmail">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                onChange={handleChange("name")}
                type="text"
                placeholder="Enter First Name"
                value={name}
              />
            </Form.Group>
          </div>
          <div className="col-6">
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                onChange={handleChange("lastname")}
                type="text"
                placeholder="Enter First Name"
                value={lastname}
              />
            </Form.Group>
          </div>
        </div>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onChange={handleChange("email")}
            type="email"
            placeholder="Enter email"
            value={email}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={handleChange("password")}
            type="password"
            placeholder="Password"
            value={password}
          />
        </Form.Group>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="I am feeling lucky today!" />
        </Form.Group>
        <Button variant="primary" onClick={onSubmit} type="submit">
          Signup
        </Button>
      </Form>
    );
  };

  const errorAlert = () => {
    if (error) {
      return <Alert variant="danger">Error: {error}</Alert>;
    }
  };

  const doRedirect = () => {
    if (redirect) {
      return (
        <Alert variant="primary">
          User was registered successfully. Please goto Signin:
          <Alert.Link href="/signin">. Let's Go</Alert.Link>
        </Alert>
      );
    }
  };

  return (
    <Base
      title="Signup"
      description="If you are already Registered, Please "
      link="/signin"
      linkTitle="Signin"
    >
      <div className="container">
        <div className="row align-item-center">
          <div className="col-8 ">
            {errorAlert()}
            {doRedirect()}
            {signupForm()}
          </div>
        </div>
      </div>
    </Base>
  );
};

export default Signup;
