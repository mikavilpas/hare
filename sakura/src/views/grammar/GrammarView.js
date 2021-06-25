import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { useHistory } from "react-router-dom";
import { useDebounce } from "use-lodash-debounce";
import { pageView } from "../../telemetry";
import ClearableSearch from "../../utils/ClearableSearch";
import Navbar from "../navbar/Navbar";

const GrammarView = ({}) => {
  const [searchInputText, setSearchInputText] = useState("");
  const debouncedInputText = useDebounce(searchInputText, 200);

  const history = useHistory();
  const searchInputRef = useRef();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    // preload the grammar search index
    setLoading(true);
    return axios
      .get("https:sp3ctum.github.io/hare/static/public/grammar-links.json")
      .then((response) => {
        const opts = response.data;
        setOptions(opts);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    pageView("grammar");
  }, []);

  useEffect(() => {
    if (searchInputText?.length > 0) {
      const re = new RegExp(searchInputText);
      const grammarMatches = options.filter((o) => re.test(o.text));
      setMatches(grammarMatches);
    } else {
      setMatches([]);
    }
  }, [debouncedInputText]);

  return (
    <main id="grammar-search" className="mb-4">
      <Row>
        <Col>
          <Navbar>Grammar search</Navbar>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form
            onSubmit={(e) => {
              e.preventDefault(); // don't reload page
              searchInputRef?.current?.blur();
            }}
          >
            <InputGroup>
              <ClearableSearch
                placeholder="Type to search grammar points"
                searchInputText={searchInputText}
                setSearchInputText={setSearchInputText}
                searchInputRef={searchInputRef}
                autoFocus={true}
              />
            </InputGroup>
          </Form>
        </Col>
      </Row>
      {loading && (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      )}
      <Row>
        <Col>
          <div id="results" className="mt-3 list-group">
            {matches.map((m, i) => {
              return (
                <a
                  className="list-group-item list-group-item-action p-1 pl-2 result-item"
                  target="_blank"
                  href={m.link}
                  rel="noopener noreferrer"
                  key={i}
                >
                  {m.text}
                </a>
              );
            })}
          </div>
        </Col>
      </Row>
    </main>
  );
};

export default GrammarView;
