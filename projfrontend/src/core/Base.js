import React from "react";
import {Jumbotron, Container, Nav} from "react-bootstrap";
import Menu from "./Menu";
import {Link} from "react-router-dom";

const Base = ({
  title = "My Title",
  description = "My description",
  link = "",
  linkTitle = "",
  children,
}) => {
  const ShowLink = (link, linkTitle) => {
    if (link !== "" && linkTitle !== "") {
      return <Link to={link}>{linkTitle}</Link>;
    }
  };

  return (
    <div>
      <Menu />
      <Jumbotron style={{marginTop: "-2em"}}>
        <Container style={{height: "60px"}}>
          <h1>{title}</h1>
          <p>
            {description} {ShowLink(link, linkTitle)}
          </p>
        </Container>
      </Jumbotron>
      {children}
    </div>
  );
};

export default Base;
