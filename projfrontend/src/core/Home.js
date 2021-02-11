import React, {useState, useEffect} from "react";
import {Card, Accordion, Form, Button, Alert} from "react-bootstrap";
import Base from "./Base";
import {isAuthenticated} from "../auth/helper/auth";
import {createNote, getNotes} from "./helper/note";

const Home = () => {
  const [values, setValues] = useState({
    title: "",
    content: "",
    file: false,
    error: false,
    success: false,
    formData: new FormData(),
  });
  var {title, content, file, error, success, formData} = values;

  const user = isAuthenticated() && isAuthenticated().user;
  const token = isAuthenticated() && isAuthenticated().token;

  const [notes, setNotes] = useState([]);

  const fetchNotes = () => {
    return getNotes(user._id, token).then((data) => {
      if (data.error) {
        setValues({...values, error: "Can't fetch all notes"});
      }
      setNotes(data.notes);
    });
  };

  useEffect(() => {
    fetchNotes();
  }, [success]);

  const handleChange = (name) => (event) => {
    const value = name === "file" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({...values, error: false, [name]: value});
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({...values, error: false});
    createNote(user._id, token, formData).then((data) => {
      if (data.error) {
        setValues({...values, error: data.error});
      }
      setValues({
        ...values,
        title: "",
        error: false,
        content: "",
        success: data.title,
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
      return <Alert variant="danger">Note created: {success}</Alert>;
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

  //get Notes on right side
  const getAllNotesList = () => {
    return (
      <Accordion defaultActiveKey="-1">
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0">
            <b>Your Notes</b>
          </Accordion.Toggle>
        </Card>
        {notes
          ? notes.map((note, index) => {
              console.log(note.title, index);
              return (
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey={index + 1}>
                    <a href={`/note/${note._id}`}>{note.title}</a>
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey={index + 1}>
                    <Card.Body>{note.content.substring(0, 30)}</Card.Body>
                  </Accordion.Collapse>
                </Card>
              );
            })
          : ""}
      </Accordion>
    );
  };

  return (
    <Base
      title={`Welcome ${user.name}`}
      description="Lets create some new Notes"
    >
      <div className="row align-item-center ">
        <div className="col-md-7 bg-light mx-auto">
          {errorAlert()}
          {successAlert()}
          {NoteForm()}
        </div>
        <div className="col-3 bg-light mx-auto">{getAllNotesList()}</div>
      </div>
    </Base>
  );
};

export default Home;
