import Alert from "react-bootstrap/Alert";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";

import { getDicts } from "../../api";
import config from "../../config";

// Dictionaries to display and preload results for
export const preferredDictionaries = [
  "広辞苑",
  "大辞林",
  "大辞泉",
  "ハイブリッド新辞林", // "新辞林",
  "学研古語辞典", //  "古語",
  "日本国語大辞典", // "日国",
  "学研国語大辞典", // "学国",
  "明鏡国語辞典", // "明鏡",
  "新明解国語辞典", // "新明解",
  "学研漢和大字典", // "漢和",
  "英辞郎",
];

// Some dicts are reported by the api with a very long name, but then the api
// only accepts the short name when querying (bug?). Converts a dict name to
// short form.
export function dictShortName(shortNameOrFullName) {
  const d = config.dictinfo.dicts.find(
    (d) =>
      d?.name == shortNameOrFullName ||
      d?.alias == shortNameOrFullName ||
      d?.id == shortNameOrFullName
  );
  return d?.alias || d?.id || d?.name || shortNameOrFullName;
}

const Dictionaries = ({ setDict }) => {
  const [dicts, setDicts] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState();

  const [selectedDict, setSelectedDict] = useState("広辞苑");

  useEffect(() => {
    setLoading(true);
    getDicts()
      .then(([response, error]) => {
        const whitelist = new Set(preferredDictionaries);
        const whitelistedDictionaries = response?.data?.filter((d) =>
          whitelist.has(d)
        );
        setDicts(whitelistedDictionaries);
        setError(error);
      })
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return <Alert>Unable to load dictionaries. {error.toString()}</Alert>;
  } else if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
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
              {dictShortName(d)}
            </span>
          );
        })}
      </aside>
    );
  }
};

export default Dictionaries;
