import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Spinner from "react-bootstrap/Spinner";
import ToggleButton from "react-bootstrap/ToggleButton";
import { useHistory, useParams } from "react-router-dom";
import { getDicts } from "../../api";
import { dictInfo, dictShortName, preferredDictionaries } from "./utils";

const DictionaryLink = ({ name, ownSearchResult, currentDict, setDict }) => {
  const shortName = dictShortName(name);
  const selected = shortName === currentDict;
  const hasResults = ownSearchResult?.result?.words?.length;

  const classes = [];
  if (selected) classes.push("selected");
  if (ownSearchResult?.error) classes.push("has-search-error");

  if (hasResults) {
    classes.push("has-search-result");
  } else {
    classes.push("disabled");
  }

  return (
    <ToggleButton
      className={classes.join(" ")}
      type="radio"
      size="lg"
      variant="secondary"
      name="radio"
      value={shortName}
      checked={currentDict === shortName}
      onChange={(e) => {
        if (selected || !hasResults) return;

        const newDict = e.currentTarget.value;
        setDict(newDict);
      }}
    >
      {shortName}
    </ToggleButton>
  );

  return (
    <span
      className={`dict-name mr-4 border-dark ${classes.join(" ")}`}
      onClick={(e, a) => {
        if (selected || !hasResults) return;

        const newDict = e.target.textContent;
        setDict(newDict);
      }}
    >
      {dictShortName(name)}
    </span>
  );
};

const Dictionaries = ({ currentDict, dicts, setDicts, searchResult }) => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState();

  const history = useHistory();
  const { dictname, searchmode = "prefix", search = "" } = useParams();

  function setDict(d) {
    if (d !== currentDict) {
      history.push(`/dict/${d}/${searchmode}/${search}/0`);
    }
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
        setDict(currentDict || whitelistedDictionaries?.[0]);
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
      <ButtonGroup toggle id="dictionary-list">
        {dicts?.map((d, i) => {
          const alias = dictInfo(d).alias;
          const ownSearchResult = searchResult?.[alias] || searchResult?.[d];
          return (
            <DictionaryLink
              key={i}
              name={d}
              ownSearchResult={ownSearchResult}
              currentDict={currentDict}
              setDict={setDict}
            />
          );
        })}
      </ButtonGroup>
    );
  }
};

export default Dictionaries;
