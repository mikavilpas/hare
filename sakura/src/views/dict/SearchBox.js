import React, { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { getWordDefinitions } from "../../api";

const SearchBox = ({
  dicts,
  searchResult,
  setSearchResult,
  setSearchLoading,
}) => {
  const [search, setSearch] = useState("");

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

  const doSearch = () => {
    setSearchLoading(true);
    setSearchResult(null);
    tempSearchResult.current = {};

    const searchPromises = dicts?.map((dict) => {
      getWordDefinitions({
        dict: dict,
        word: search,
      })
        .then(([result, error]) => {
          singleDictSearchResult(dict, search, result, error);
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
