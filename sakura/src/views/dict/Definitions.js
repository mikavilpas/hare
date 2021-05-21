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

import {
  useHistory,
  useParams,
  useRouteMatch,
  generatePath,
  useLocation,
} from "react-router-dom";
import { dictInfo, urls } from "./utils";
import RecursiveLookup from "../recursiveLookup/index";

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

function prettifyLines(text) {
  // must receive text in a non-bbcode format!
  return text
    ?.split(/\n/)
    .filter((line) => line) // remove empty lines
    .map((line, i) => {
      return `<p class="definition-row"> ${line} </p> `;
    });
}

function prettyText(text) {
  const lines = prettifyLines(bbcode2Text(text));
  return lines.join("");
}

const Definition = ({ i, definition, goToRecursiveLookupPage }) => {
  // always open the first card by default
  const [hasBeenOpened, setHasBeenOpened] = useState(i === 0);
  const [analysisResult, setAnalysisResult] = useState();
  const [analysisError, setAnalysisError] = useState();

  useEffect(() => {
    if (hasBeenOpened && definition?.text) {
      const text = bbcode2Text(definition.text);
      textAnalysis(text).then(([html, error]) => {
        setAnalysisResult(html);
        setAnalysisError(error);
      });
    }
  }, [hasBeenOpened, definition]);

  return (
    <Card key={i}>
      <Accordion.Toggle
        as={Card.Header}
        eventKey={i.toString()}
        onClick={() => setHasBeenOpened(true)}
      >
        <h4
          dangerouslySetInnerHTML={{ __html: prettyText(definition?.heading) }}
        ></h4>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={i.toString()}>
        <Card.Body>
          <div
            onClick={(e) => {
              const word = e?.target?.parentElement?.dataset?.word;
              if (word) {
                goToRecursiveLookupPage(word);
              }
            }}
            dangerouslySetInnerHTML={{
              __html: prettyText(analysisResult || definition?.text),
            }}
          ></div>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
};

const Definitions = ({
  dict,
  definitions,
  searchError,
  searchLoading,
  goToRecursiveLookupPage,
}) => {
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

  if (!definitions) return "";

  return (
    <Accordion className="definition-listing" defaultActiveKey="0">
      {definitions.words?.map((w, i) => {
        return (
          <Definition
            key={`${dict}_${i}`}
            i={i}
            definition={w}
            goToRecursiveLookupPage={goToRecursiveLookupPage}
          />
        );
      })}
    </Accordion>
  );
};

export default Definitions;
