import React, { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { getWordDefinitions } from "../../api";
import { useHistory, useParams } from "react-router-dom";

const SearchBox = ({
  currentDict,
  dicts,
  searchResult,
  setSearchResult,
  setSearchLoading,
}) => {
  const { searchmode = "", search = "" } = useParams();
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
    // on the first load after dicts have been received, redo a search based on
    // the url (if applicable)
    if (searchmode && search) {
      doSearch();
    }
  }, [dicts]);

  const doSearch = () => {
    setSearchLoading(true);
    setSearchResult(null);
    tempSearchResult.current = {};

    const searchmode = "prefix";
    history.push(`/dict/${currentDict}/${searchmode}/${searchInputText}`);
    const searchPromises = dicts?.map((dict) => {
      getWordDefinitions({
        dict: dict,
        word: searchInputText || search,
      })
        .then(([result, error]) => {
          singleDictSearchResult(dict, searchInputText, result, error);
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
        doSearch();
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
              <Button block onClick={() => doSearch()}>
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
