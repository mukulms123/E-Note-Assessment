import React, {useState} from "react";
import Base from "./Base";
import {Form, Button, Alert} from "react-bootstrap";
import {signin, isAuthenticated, authenticate} from "./helper/auth";
import {Redirect} from "react-router-dom";

const Signin = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    redirect: false,
  });
  const {email, password, error, redirect} = values;
  const handleChange = (name) => (event) => {
    setValues({...values, error: false, [name]: event.target.value});
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({...values, error: false});
    signin({email, password}).then((data) => {
      if (data.error) {
        setValues({...values, error: data.error, redirect: false});
      } else {
        authenticate(data, () => {
          setValues({...values, error: false, redirect: true});
        });
      }
    });
  };

  const signinForm = () => {
    return (
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onChange={handleChange("email")}
            type="email"
            placeholder="Enter email"
            value={email}
          />
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
        <Button variant="primary" onClick={onSubmit} type="submit">
          Submit
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
      return <Redirect to="/" />;
    }
  };

  return (
    <Base
      title="Signin"
      description="If you are not Registered, Please "
      link="/signup"
      linkTitle="Signup"
    >
      <div className="container">
        <div className="row align-item-center">
          <div className="col-8 ">
            {errorAlert()}
            {signinForm()}
            {doRedirect()}
          </div>
        </div>
      </div>
    </Base>
  );
};

export default Signin;
