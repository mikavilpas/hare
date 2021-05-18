import Alert from "react-bootstrap/Alert";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";

import { getDicts } from "../../api";
import config from "../../config";

import { useHistory, useParams, useRouteMatch } from "react-router-dom";

// Dictionaries to display and preload results for. These are either the id or
// alias properties from the config.dictinfo
export const preferredDictionaries = [
  "広辞苑",
  "大辞林",
  "大辞泉",
  "新辞林",
  "古語",
  "日国",
  "学国",
  "明鏡",
  "新明解",
  "漢和",
  "英辞郎",
];

// Some dicts are reported by the api with a very long name, but then the api
// only accepts the short name when querying (bug?). Converts a dict name to
// short form.
export function dictInfo(dictAliasOrId) {
  const d = config.dictinfo.dicts.find(
    (d) => d?.alias == dictAliasOrId || d?.id == dictAliasOrId
  );
  if (!d) console.warn(`Unable to find the dict ${dictAliasOrId}`);
  return d;
}

export function dictShortName(dictAliasOrId) {
  const dictObject = dictInfo(dictAliasOrId);
  return dictObject?.alias || dictObject?.id;
}

const Dictionaries = ({ currentDict, dicts, setDicts, searchResult }) => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState();

  const history = useHistory();
  const params = useParams();

  function setDict(d) {
    history.push(`/dict/${d}`);
  }

  useEffect(() => {
    setLoading(true);
    getDicts()
      .then(([response, error]) => {
        const whitelist = new Set(preferredDictionaries);
        const whitelistedDictionaries = response?.data?.filter((d) => {
          const shortName = dictShortName(d);
          return whitelist.has(shortName);
        });
        setDicts(whitelistedDictionaries);
        setDict(whitelistedDictionaries?.[0]);
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
          const selected = dictShortName(d) === currentDict;

          const classes = [];
          if (selected) classes.push("selected");
          if (searchResult?.[d]?.result) classes.push("has-search-result");
          if (searchResult?.[d]?.error) classes.push("has-search-error");

          return (
            <span
              className={`dict-name mr-4 border-dark ${classes.join(" ")}`}
              key={i}
              onClick={(e, a) => {
                const newDict = e.target.textContent;
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
