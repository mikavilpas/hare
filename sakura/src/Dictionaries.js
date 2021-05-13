import Alert from "react-bootstrap/Alert";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import React, { useState, useEffect } from "react";

import { getDicts } from "./api";

const Dictionaries = ({ setDict }) => {
  const [dicts, setDicts] = useState([]);
  const [error, setError] = useState();

  const [selectedDict, setSelectedDict] = useState("広辞苑");

  useEffect(() => {
    getDicts().then(([response, error]) => {
      setDicts(response.data);
      setError(error);
    });
  }, []);

  if (error) {
    return (
      <Alert>Unable to load dictionaries. Error: {error.toString()}</Alert>
    );
  } else {
    return (
      <aside id="dictionary-list">
        {dicts?.map((d, i) => {
          const selected = d === selectedDict;
          const selectedClass = selected ? "text-primary" : "text-secondary";
          return (
            <span
              className={"dict-name mr-4 border-dark " + selectedClass}
              key={i}
              onClick={(e, a) => {
                const newDict = e.target.textContent;
                setSelectedDict(newDict);
                setDict(newDict);
              }}
            >
              {d}
            </span>
          );
        })}
      </aside>
    );
  }
};

export default Dictionaries;
