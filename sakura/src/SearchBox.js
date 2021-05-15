import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { getWordDefinitions } from "./api";

const SearchBox = ({ dict, setSearchResult, setSearchError }) => {
  const [search, setSearch] = useState("");

  const doSearch = () => {
    getWordDefinitions({
      dict: dict,
      word: search,
    }).then(([result, error]) => {
      setSearchResult(result);
      setSearchError(error);
    });
  };

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
            <Col xs={2}>
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
