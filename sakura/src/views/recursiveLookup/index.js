import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

import { getWordDefinitions } from "../../api";

function RecursiveLookup({ word, hide }) {
  const [searchResult, setSearchResult] = useState();
  const [searchResultLoading, setSearchResultLoading] = useState(false);
  const [searchResultError, setSearchResultError] = useState();

  const dictname = "広辞苑";

  useEffect(() => {
    setSearchResult(null);
    setSearchResultError(null);
    setSearchResultLoading(true);
    getWordDefinitions({ dict: dictname, word: word })
      .then(([result, error]) => {
        setSearchResult(result);
        setSearchResultError(error);
      })
      .finally(() => setSearchResultLoading(false));
  }, [word]);

  const contents = () => {
    if (searchResultLoading) {
      return (
        <div>
          {word}
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      );
    }
    if (searchResultError) {
      return (
        <Alert variant={"danger"}>
          <p>Error loading results</p>
          <p>{searchResultError.toString()}</p>
        </Alert>
      );
    }

    return word + " search successful";
  };

  return (
    <Modal
      show={word?.length > 0}
      onHide={() => hide()}
      dialogClassName="recursive-lookup"
    >
      <Modal.Body>{contents()}</Modal.Body>
    </Modal>
  );
}

export default RecursiveLookup;
