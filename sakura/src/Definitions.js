import Alert from "react-bootstrap/Alert";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import React, { useState, useEffect } from "react";

import { getDicts } from "./api";
import config from "./config";

import BBCode from "@bbob/react/es/Component";
import reactPreset from "@bbob/preset-react/es";

const mypreset = reactPreset.extend((tags, options) => ({
  ...tags,
  keyword: (node) => ({
    tag: "mark",
    content: node.content,
  }),
  superscript: (node) => ({
    tag: "sup",
    content: node.content,
  }),
}));

function bbcode2React(text) {
  console.log(text);
  return (
    <BBCode
      plugins={[mypreset()]}
      options={{ onlyAllowTags: ["i", "keyword", "superscript"] }}
    >
      {text}
    </BBCode>
  );
}

const Definitions = ({ dict, searchResult }) => {
  return (
    <Accordion className="definition-listing" defaultActiveKey="0">
      {searchResult?.words?.map((w, i) => {
        return (
          <Card key={i}>
            <Accordion.Toggle as={Card.Header} eventKey={i.toString()}>
              <h4>{w?.heading}</h4>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={i.toString()}>
              <Card.Body>{bbcode2React(w.text)}</Card.Body>
            </Accordion.Collapse>
          </Card>
        );
      })}
    </Accordion>
  );
};

export default Definitions;
