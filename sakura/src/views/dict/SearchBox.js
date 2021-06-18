import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { generatePath, useHistory, useParams } from "react-router-dom";
import { getWordDefinitions } from "../../api";
import ClearableSearch from "../../utils/ClearableSearch";
import { urls } from "./utils";

const SearchBox = ({
  currentDict,
  dicts,
  searchResult,
  setSearchResult,
  setSearchLoading,
}) => {
  const params = useParams();
  const { searchmode = "", search = "" } = params;
  const [searchInputText, setSearchInputText] = useState(search);
  const history = useHistory();
  const searchInputRef = useRef();

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
    // redo a search based on the url
    if (searchmode && search) {
      setSearchInputText(search);
      doSearch(search);
    }
  }, [dicts, searchmode, search]);

  const applySearchToUrl = () => {
    if (search !== searchInputText) {
      // if a new search is made, go to the lookup page
      const lookupUrl = generatePath(urls.lookup, {
        dictname: currentDict,
        searchmode: "prefix",
        search: searchInputText,
        openeditem: 0, // open first result
      });
      history.push(lookupUrl);
    }
  };

  const doSearch = (word) => {
    document.activeElement?.blur();
    setSearchLoading(true);
    setSearchResult(null);
    tempSearchResult.current = {};

    const searchPromises = dicts?.map((dict) => {
      getWordDefinitions({
        dict: dict,
        word: word,
      })
        .then(([result, error]) => {
          singleDictSearchResult(dict, word, result, error);
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
        applySearchToUrl();
      }}
    >
      <InputGroup className="no-gutters">
        <ClearableSearch
          searchInputText={searchInputText}
          setSearchInputText={setSearchInputText}
          searchInputRef={searchInputRef}
        />
        <InputGroup.Append>
          <Button
            block
            onClick={() => applySearchToUrl()}
            className="border-0 rounded-right"
          >
            Search
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </Form>
  );
};

export default SearchBox;
