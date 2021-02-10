import React, {useState, useEffect, Fragment} from "react";
import {API} from "../backend";
import {Card, Accordion, Form, Button, Alert} from "react-bootstrap";
import {Redirect, useHistory as history} from "react-router-dom";
import Base from "./Base";
import {useParams} from "react-router-dom";
import {isAuthenticated} from "../auth/helper/auth";
import {createNote, getNote, getFile, removeNote} from "./helper/note";

const Note = () => {
  const {id} = useParams();
  const user = isAuthenticated() && isAuthenticated().user;
  const token = isAuthenticated() && isAuthenticated().token;
  const [values, setValues] = useState({
    title: "",
    content: "",
    filename: "",
    created: "",
    error: false,
    redirect: false,
  });

  const {title, content, filename, created, error, redirect} = values;

  const loadNote = () => {
    return getNote(user._id, token, id).then((data) => {
      if (data.error) {
        setValues({...values, error: data.error});
      }
      setValues({
        ...values,
        title: data.title,
        content: data.content,
        filename: data.filename,
        created: data.createdAt,
      });
    });
  };

  useEffect(() => {
    loadNote();
  }, []);

  const deleteNote = (event) => {
    event.preventDefault();
    removeNote(user._id, token, id).then((data) => {
      if (data.error) {
        setValues({...values, error: data.error});
      }
      setValues({
        ...values,
        error: "Note deleted successfully!",
        redirect: true,
      });
    });
  };

  const NoteDisplay = () => {
    return (
      <Card className="mx-4">
        <Card.Body>
          <Card.Title>
            <h3>
              <div className="text-muted" style={{display: "inline-block"}}>
                Content:
              </div>
            </h3>
          </Card.Title>

          <Card>
            <Card.Body>{content}</Card.Body>
          </Card>
          {filename ? (
            <Fragment>
              <Card className="my-2">
                <Card.Body>
                  <Card.Title>File:</Card.Title> {filename}
                  <br />
                  <br />
                  <a
                    href={`${API}/note/${id}/file/${user._id}`}
                    className="btn btn-success"
                    download
                  >
                    Download file
                  </a>
                </Card.Body>
              </Card>
            </Fragment>
          ) : (
            ""
          )}
        </Card.Body>
        <div className="row align-item-center my-2">
          <div className="col-md-4">
            <a
              href={`/note/update/${id}`}
              className="btn btn-block btn-warning"
            >
              Update
            </a>
          </div>
          <div className="col-md-4">
            <Button className="btn btn-danger btn-block" onClick={deleteNote}>
              Delete
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  const getDateNTime = (date = "") => {
    var day_time = date.split("T");
    return day_time[0];
  };

  const errorAlert = () => {
    if (error) {
      return <Alert variant="warning">Error: {error}</Alert>;
    }
  };

  const performRedirect = () => {
    if (redirect) {
      return <Redirect to="/" />;
    }
  };

  return (
    <Base title={title} description={`Created at: ${getDateNTime(created)}`}>
      {errorAlert()}
      {NoteDisplay()}
      {performRedirect()}
    </Base>
  );
};

export default Note;
