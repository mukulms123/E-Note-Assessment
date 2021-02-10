import React, {useState, useEffect} from "react";
import {Card, Accordion, Form, Button, Alert} from "react-bootstrap";
import {Redirect, useHistory as history} from "react-router-dom";
import Base from "./Base";
import {isAuthenticated} from "../auth/helper/auth";
import {updateNote, getNote} from "./helper/note";
import {useParams} from "react-router-dom";

const Edit = () => {
  const [values, setValues] = useState({
    title: "",
    content: "",
    file: false,
    error: false,
    success: false,
    redirect: false,
    formData: new FormData(),
  });
  var {title, content, file, error, success, formData, redirect} = values;

  const {id} = useParams();

  const user = isAuthenticated() && isAuthenticated().user;
  const token = isAuthenticated() && isAuthenticated().token;

  const fetchNote = () => {
    return getNote(user._id, token, id).then((data) => {
      if (data.error) {
        setValues({...values, error: data.error});
      }
      formData.set("title", data.title);
      formData.set("content", data.content);
      setValues({
        ...values,
        title: data.title,
        content: data.content,
        filename: data.filename,
      });
    });
  };

  useEffect(() => {
    fetchNote();
  }, []);

  const handleChange = (name) => (event) => {
    const value = name === "file" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({...values, error: false, [name]: value});
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({...values, error: false});
    updateNote(user._id, token, id, formData).then((data) => {
      if (data.error) {
        setValues({...values, error: data.error});
      }
      setValues({
        ...values,
        title: "",
        error: false,
        content: "",
        success: data.title,
        redirect: true,
      });
    });
  };

  const errorAlert = () => {
    if (error) {
      return <Alert variant="warning">Error: {error}</Alert>;
    }
  };

  const successAlert = () => {
    if (success) {
      return <Alert variant="danger">Note updated: {success}</Alert>;
    }
  };

  const performRedirect = () => {
    if (redirect) {
      return <Redirect to={`/note/${id}`} />;
    }
  };

  //Form to take notes.
  const NoteForm = () => {
    return (
      <Card>
        <Card.Body>
          <Form>
            <Alert variant="success align-item-center">
              <Card.Title>
                <h3>Note Title:</h3>
              </Card.Title>
              <Card.Subtitle className="text-muted">
                (Minimum 4 characters)
              </Card.Subtitle>
              <Form.Group className="my-2" controlId="formTitle">
                <Form.Control
                  size="lg"
                  onChange={handleChange("title")}
                  type="text"
                  value={title}
                />
              </Form.Group>
            </Alert>

            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>
                <h4>Content</h4>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={content}
                onChange={handleChange("content")}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                <h4>Upload File:</h4>
              </Form.Label>
              <input
                type="file"
                class="form-control"
                id="customFile"
                onChange={handleChange("file")}
              />
            </Form.Group>

            <Button variant="success" onClick={onSubmit} type="submit">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    );
  };

  return (
    <Base title="Update" description="Adding new File will replace old file.">
      <div className="row align-item-center ">
        <div className="col-md-8 bg-light mx-auto">
          {errorAlert()}
          {successAlert()}
          {NoteForm()}
          {performRedirect()}
        </div>
      </div>
    </Base>
  );
};

export default Edit;
