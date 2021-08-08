import React from "react";
import Alert from "react-bootstrap/Alert";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Spinner from "react-bootstrap/Spinner";
import ToggleButton from "react-bootstrap/ToggleButton";
import { useHistory, useParams } from "react-router-dom";
import { dictInfo } from "./utils";

const DictionaryLink = ({ alias, ownSearchResult, currentDict, setDict }) => {
  const selected = alias === currentDict;
  const hasResults = ownSearchResult?.result?.words?.length;

  const classes = ["dict"];
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
      value={alias}
      checked={currentDict === alias}
      onChange={(e) => {
        if (selected || !hasResults) return;

        const newDict = e.currentTarget.value;
        setDict(newDict);
      }}
    >
      {alias}
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
      {alias}
    </span>
  );
};

const Dictionaries = ({
  currentDict,
  dicts,
  setDicts,
  yomichanDicts,
  searchResult,
  loading,
  error,
}) => {
  const history = useHistory();
  const { dictname, searchmode = "prefix", search = "" } = useParams();

  function setDict(d) {
    if (d !== currentDict) {
      history.push(`/dict/${d}/${searchmode}/${search}/0`);
    }
  }

  if (error) {
    return <Alert>Unable to load dictionaries. {error.toString()}</Alert>;
  } else if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  } else {
    const apiDictButtons = dicts?.map((d, i) => {
      const alias = dictInfo(d).alias || dictInfo(d).id;
      const ownSearchResult = searchResult?.[alias] || searchResult?.[d];
      return (
        <DictionaryLink
          key={i}
          alias={alias}
          ownSearchResult={ownSearchResult}
          currentDict={currentDict}
          setDict={setDict}
        />
      );
    });

    const yomiDictButtons = yomichanDicts?.map((d, i) => {
      const alias = d.alias;
      const ownSearchResult = searchResult?.[alias] || searchResult?.[d];
      return (
        <DictionaryLink
          key={i}
          alias={alias}
          ownSearchResult={ownSearchResult}
          currentDict={currentDict}
          setDict={setDict}
        />
      );
    });

    return (
      <ButtonGroup toggle id="dictionary-list">
        {yomiDictButtons}
        {apiDictButtons}
      </ButtonGroup>
    );
  }
};

export default Dictionaries;
