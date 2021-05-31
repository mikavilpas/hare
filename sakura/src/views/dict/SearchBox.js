import React, { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { getWordDefinitions } from "../../api";
import { useHistory, useParams, generatePath } from "react-router-dom";
import { urls } from "./utils";

const SearchBox = ({
  currentDict,
  dicts,
  searchResult,
  setSearchResult,
  setSearchLoading,
}) => {
  const params = useParams();
  const { searchmode = "", search = "" } = params;
  const [searchInputText, setSearchInputText] = useState(search);
  const history = useHistory();

  const tempSearchResult = useRef();
  const singleDictSearchResult = (d, searchQuery, result, error) => {
    const newResult = {
      ...tempSearchResult.current,
      searchQuery: searchQuery,
      searchMode: "prefix",
      [d]: { result: result, error: error },
    };
    tempSearchResult.current = newResult;
    setSearchResult(newResult);
  };

  useEffect(() => {
    // redo a search based on the url
    if (searchmode && search) {
      setSearchInputText(search);
      doSearch(search);
    }
  }, [dicts, searchmode, search]);

  const applySearchToUrl = () => {
    if (search !== searchInputText) {
      // if a new search is made, go to the lookup page
      const lookupUrl = generatePath(urls.lookup, {
        dictname: currentDict,
        searchmode: "prefix",
        search: searchInputText,
        openeditem: 0, // open first result
      });
      history.push(lookupUrl);
    }
  };

  const doSearch = (word) => {
    document.activeElement?.blur();
    setSearchLoading(true);
    setSearchResult(null);
    tempSearchResult.current = {};

    const searchPromises = dicts?.map((dict) => {
      getWordDefinitions({
        dict: dict,
        word: word,
      })
        .then(([result, error]) => {
          singleDictSearchResult(dict, word, result, error);
        })
        .finally(() => setSearchLoading(false));
    });

    return Promise.allSettled(searchPromises);
  };

  if (!dicts?.length) return "";
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault(); // don't reload page
        applySearchToUrl();
      }}
    >
      <Form.Group>
        <div className="flex justify-content-end">
          <Row>
            <Col>
              <Form.Control
                type="search"
                spellCheck={false}
                value={searchInputText}
                onChange={(e) => setSearchInputText(e.target.value)}
              />
            </Col>
            <Col xs={5} md={2}>
              <Button block onClick={() => applySearchToUrl()}>
                Search
              </Button>
            </Col>
          </Row>
        </div>
      </Form.Group>
    </Form>
  );
  return "hello";
};

export default SearchBox;
