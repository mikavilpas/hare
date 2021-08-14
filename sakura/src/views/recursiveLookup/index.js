import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import {
  generatePath,
  Link,
  useHistory,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import { searchSingleDict } from "../../utils/search";
import Definitions from "../dict/Definitions";

function RecursiveLookup({ yomichanDicts, db, goToRecursiveLookupPage, hide }) {
  const [searchResult, setSearchResult] = useState();
  const [searchResultLoading, setSearchResultLoading] = useState(false);
  const [searchResultError, setSearchResultError] = useState();
  const match = useRouteMatch();
  const history = useHistory();

  const p = match?.params;
  const makeExportLink = () => {
    return `/export/${p?.rdict}/${p?.rsearchmode}/${p?.rsearch}/${p?.ropeneditem}`;
  };

  const { rdict = yomichanDicts?.[0] || "大辞林", rsearch } = useParams();

  useEffect(() => {
    if (!rdict || !rsearch) return;

    setSearchResult(null);
    setSearchResultError(null);
    setSearchResultLoading(true);

    const word = rsearch;
    searchSingleDict(word, rdict, db, yomichanDicts)
      .then((resultObject) => {
        const result = resultObject?.result;
        setSearchResult(result);
      })
      .catch((error) => setSearchResultError(error))
      .finally(() => setSearchResultLoading(false));
  }, [rdict, rsearch]);

  const contents = () => {
    if (searchResultLoading) {
      return (
        <div>
          {rsearch}
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

    if (!searchResult?.words?.length) {
      return (
        <Alert variant={"secondary"}>
          <p>No results found for {rsearch}.</p>
          <p>
            Try{" "}
            <Alert.Link to={`/dict/${rdict}/prefix/${rsearch}/0`} as={Link}>
              searching in all dictionaries
            </Alert.Link>
            .
          </p>
        </Alert>
      );
    }

    return (
      <Definitions
        dict={rdict}
        definitions={searchResult}
        searchLoading={searchResultLoading}
        goToRecursiveLookupPage={goToRecursiveLookupPage}
        currentTab={match.params.ropeneditem}
        openTab={(index) => {
          const url = generatePath(match.path, {
            ...match.params,
            ropeneditem: index || "-",
          });
          history.push(url);
        }}
        makeExportLink={makeExportLink}
      />
    );
  };

  return (
    <Modal
      show={rsearch?.length > 0}
      onHide={() => hide()}
      dialogClassName="recursive-lookup"
    >
      <Modal.Body>{contents()}</Modal.Body>
    </Modal>
  );
}

export default RecursiveLookup;
