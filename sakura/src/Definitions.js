import Alert from "react-bootstrap/Alert";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Spinner from "react-bootstrap/Spinner";

import React, { useState, useEffect } from "react";

import { getDicts } from "./api";
import config from "./config";

import bbobReactRender from "@bbob/react/es/render";
import presetReact from "@bbob/preset-react";

const mypreset = presetReact.extend((tags, options) => ({
  ...tags,

  // TODO: rendering rules from the host site. These need beautifying
  keyword: (node) => ({ tag: "mark", content: node.content }),
  superscript: (node) => ({ tag: "sup", content: node.content }),
  subscript: (node) => ({ tag: "sub", content: node.content }),
  decoration: (node) => ({ tag: "b", content: node.content }),
  emphasis: (node) => ({ tag: "em", content: node.content }),

  // →
  // TODO support reference
  // TODO support image
  // TODO support mono
  // TODO support wav
}));

function bbcode2React(text) {
  return text?.split(/\n/).map((line, i) => {
    const textified = bbobReactRender(line, mypreset(), {
      onlyAllowTags: ["keyword", "superscript"],
    });
    console.log(textified);
    return (
      <p className="definition-row" key={i}>
        {textified}
      </p>
    );
  });
}

const Definitions = ({ dict, searchResult, searchError, searchLoading }) => {
  if (searchLoading) {
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  } else if (searchError) {
    return (
      <Alert variant={"danger"}>
        <p>Error loading results</p>
        <p>{searchError.toString()}</p>
      </Alert>
    );
  }
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
