import Alert from "react-bootstrap/Alert";
import ListGroup from "react-bootstrap/ListGroup";
import React, { useState, useEffect } from "react";

import { getDicts } from "./api";

const Dictionaries = ({}) => {
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
        <ListGroup>
          {dicts?.map((d, i) => {
            const selected = d === selectedDict;
            return (
              <ListGroup.Item
                active={selected}
                variant={selected ? "primary" : ""}
                key={i}
                as="span"
              >
                {d}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </aside>
    );
  }
};

export default Dictionaries;
