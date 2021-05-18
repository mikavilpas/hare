import Alert from "react-bootstrap/Alert";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Spinner from "react-bootstrap/Spinner";

import React, { useState, useEffect } from "react";

import { getDicts, textAnalysis } from "../../api";
import config from "../../config";

import html5Preset from "@bbob/preset-html5/es";
import { render } from "@bbob/html/es";
import bbob from "@bbob/core";

import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import parse from "html-react-parser";
import { dictInfo } from "./utils";

const mypreset = html5Preset.extend((tags, options) => ({
  ...tags,

  // TODO: rendering rules from the host site. These need beautifying
  keyword: (node) => ({ tag: "mark", content: node.content }),
  superscript: (node) => ({ tag: "sup", content: node.content }),
  subscript: (node) => ({ tag: "sub", content: node.content }),
  decoration: (node) => ({ tag: "b", content: node.content }),
  emphasis: (node) => ({ tag: "em", content: node.content }),
  reference: (node) => ({ tag: "span", content: node.content }),

  // →
  // TODO support image
  // TODO support mono
  // TODO support wav
}));

function bbcode2Text(text) {
  const bbconverter = bbob(mypreset());
  const options = {
    render,
    onlyAllowTags: [
      "keyword",
      "superscript",
      "subscript",
      "decoration",
      "emphasis",
      "reference",
    ],
  };
  const textified = bbconverter.process(text, options).html;
  return textified;
}

function reactifyLines(text) {
  // must receive text in a non-bbcode format!
  return text?.split(/\n/).map((line, i) => {
    const reactChildren = parse(line);
    return (
      <p className="definition-row" key={i}>
        {reactChildren}
      </p>
    );
  });
}

function prettyText(text) {
  return reactifyLines(bbcode2Text(text));
}

const Definition = ({ i, definition }) => {
  // always open the first card by default
  const [opened, setOpened] = useState(i === 0);
  const [analysisResult, setAnalysisResult] = useState();
  const [analysisError, setAnalysisError] = useState();

  useEffect(() => {
    if (opened && definition?.text) {
      const text = bbcode2Text(definition.text);
      textAnalysis(text).then(([html, error]) => {
        setAnalysisResult(html);
        setAnalysisError(error);
      });
    }
  }, [opened, definition]);

  return (
    <Card key={i}>
      <Accordion.Toggle
        as={Card.Header}
        eventKey={i.toString()}
        onClick={() => setOpened(true)}
      >
        <h4>{prettyText(definition?.heading)}</h4>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={i.toString()}>
        <Card.Body>{prettyText(analysisResult || definition?.text)}</Card.Body>
      </Accordion.Collapse>
    </Card>
  );
};

const Definitions = ({ dict, searchResult, searchError, searchLoading }) => {
  if (!dict) return "";

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

  const dictinfo = dictInfo(dict);
  const result =
    searchResult[dictinfo.id]?.result || searchResult[dictinfo.alias]?.result;
  if (!result) return "";

  return (
    <Accordion className="definition-listing" defaultActiveKey="0">
      {result.words?.map((w, i) => {
        return <Definition key={`${dict}_${i}`} i={i} definition={w} />;
      })}
    </Accordion>
  );
};

export default Definitions;
