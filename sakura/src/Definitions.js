import Alert from "react-bootstrap/Alert";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import React, { useState, useEffect } from "react";

import { getDicts } from "./api";
import config from "./config";

const Definitions = ({ adict, searchResult }) => {
  return (
    <Accordion className="definition-listing" defaultActiveKey="0">
      {searchResult?.words?.map((w, i) => {
        return (
          <Card key={i}>
            <Accordion.Toggle as={Card.Header} eventKey={i.toString()}>
              <h2>{w?.heading}</h2>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={i.toString()}>
              <Card.Body>{w?.text}</Card.Body>
            </Accordion.Collapse>
          </Card>
        );
      })}
    </Accordion>
  );
};

export default Definitions;
