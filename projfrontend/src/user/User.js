import React, {useState, useEffect, Fragment} from "react";
import {Card, Accordion, Form, Button, Alert} from "react-bootstrap";
import {CanvasJSChart} from "canvasjs-react-charts";
import Base from "../core/Base";
import {isAuthenticated} from "../auth/helper/auth";
import {createNote, getNotes} from "../core/helper/note";
import {useParams} from "react-router-dom";

const User = () => {
  const [values, setValues] = useState({
    notes: [],
    error: false,
    success: false,
  });

  const {id} = useParams();
  const user = isAuthenticated() && isAuthenticated().user;
  const token = isAuthenticated() && isAuthenticated().token;

  const {notes, error, success} = values;

  const fetchNotes = () => {
    setValues({...values, error: false, success: false});
    return getNotes(user._id, token).then((data) => {
      if (data.error) {
        setValues({...values, error: "Can't fetch all notes"});
      }
      setValues({...values, error: false, notes: data.notes});
    });
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const errorAlert = () => {
    if (error) {
      return <Alert variant="warning">Error: {error}</Alert>;
    }
  };

  const successAlert = () => {
    if (success) {
      return (
        <Alert variant="danger">
          {notes.length} notes fetched from Database
        </Alert>
      );
    }
  };

  //Make dashboard
  const evaluateDashBoard = () => {
    var noteArr = notes;
    var createdArr = [];

    noteArr.map((note, index) => {
      var date = note.createdAt.split("T")[0];
      date = new Date(date);
      var endDate = new Date();
      endDate.setDate(endDate.getDate() - 7);
      endDate.setHours(0, 0, 0);
      if (endDate <= date) {
        createdArr.push(date);
      }
    });

    createdArr.map((date, index) => {
      createdArr[index] = date.toString().substring(0, 10);
    });

    //Making final array which stores the occurences
    var finalArr = {};
    createdArr.map((date) => {
      finalArr[date] = finalArr[date] ? finalArr[date] + 1 : 1;
    });

    //adding 0 records to finalArr
    for (var i = 7; i > 0; i--) {
      var date = new Date();
      date.setDate(date.getDate() - i);
      date = date.toString().substring(0, 10);
      finalArr[date] = finalArr[date] ? finalArr[date] : 0;
    }

    var dummyArr = [];
    for (var i = 7; i > 0; i--) {
      var date = new Date();
      date.setDate(date.getDate() - i);
      date = date.toString().substring(0, 10);
      dummyArr.push(date);
    }

    var result = [];
    dummyArr.map((date) => {
      var data = {
        label: date,
        y: finalArr[date],
      };
      result.push(data);
    });

    const options = {
      data: [
        {
          // Change type to "doughnut", "line", "splineArea", etc.
          type: "column",
          dataPoints: result,
        },
      ],
    };

    return (
      <Fragment>
        <div className="text-center">
          <h2>Record of last 7 days</h2>
        </div>
        <CanvasJSChart options={options} />
      </Fragment>
    );
  };

  //get Notes on right side
  const getAllNotesList = () => {
    return (
      <Accordion defaultActiveKey="-1">
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0">
            <b>Your have created {notes.length} notes</b>
          </Accordion.Toggle>
        </Card>
        {notes.map((note, index) => {
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
        })}
      </Accordion>
    );
  };

  return (
    <Base title="DashBoard" description="Lets see What you have done">
      <div className="row align-item-center ">
        <div className="col-md-7 bg-light mx-auto">
          {errorAlert()}
          {successAlert()}
          {evaluateDashBoard()}
        </div>
        <div className="col-3 mx-auto">{getAllNotesList()}</div>
      </div>
    </Base>
  );
};

export default User;
