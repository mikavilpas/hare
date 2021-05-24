import React, { useState, useEffect, useRef } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import {
  useHistory,
  useRouteMatch,
  useParams,
  generatePath,
} from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

import { getWordDefinitions } from "../../api";
import { bbcode2Text, prettyText } from "../dict/utils";
import { CopyToClipboard } from "react-copy-to-clipboard";

function ExportView({}) {
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState();
  const [searchError, setSearchError] = useState();
  const definitionRef = useRef();

  const match = useRouteMatch();
  const dict = match.params.dictname;
  const search = match.params.search;
  const openeditem = match.params.openeditem;

  const [copiableText, setCopiableText] = useState();

  useEffect(() => {
    if (!dict || !search || !openeditem) {
      setSearchResult(null);
      setSearchError(
        "Invalid search parameters. Please go back and try again."
      );
      return;
    }

    setLoading(true);
    getWordDefinitions({ dict: dict, word: search })
      .then(([result, error]) => {
        const searchResultItem = result?.words?.[openeditem];
        if (!searchResultItem) {
          setSearchError("search result did not contain the searched word");
          setSearchResult(null);
        } else {
          setSearchResult(searchResultItem);
          setSearchError(error);
        }
      })
      .finally(() => setLoading(false));
  }, [match.params]);

  if (searchError) {
    return <Alert variant="danger">Error: {searchError}</Alert>;
  }
  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }

  if (!searchResult) {
    return "";
  }

  const headingText = prettyText(searchResult.heading);
  const bodyText = prettyText(searchResult.text);
  return (
    <Container id="export" className="mt-2">
      <Row id="definition-preview" className="d-flex flex-column h-50">
        <div className="card">
          <div className="card-body" ref={definitionRef}>
            <h3
              className="card-title"
              dangerouslySetInnerHTML={{
                __html: headingText,
              }}
            ></h3>
            <p
              className="card-text"
              dangerouslySetInnerHTML={{
                __html: bodyText,
              }}
            ></p>
          </div>
        </div>
        <div>
          <CopyToClipboard text={copiableText} onCopy={() => {}}>
            <Button
              variant="outline-primary"
              onClick={() => {
                const text = definitionRef.current?.innerText
                  ?.split("\n")
                  .filter((l) => l.length > 0)
                  .join("\n");
                setCopiableText(text);
              }}
            >
              Copy text
            </Button>
          </CopyToClipboard>
        </div>
      </Row>
    </Container>
  );
}

export default ExportView;
