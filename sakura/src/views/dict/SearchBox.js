import { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { generatePath, useHistory, useParams } from "react-router-dom";
import ClearableSearch from "../../utils/ClearableSearch";
import { searchYomichanAndApi } from "../../utils/search";
import { urls } from "./utils";

const SearchBox = ({
  currentDict,
  dicts,
  db,
  yomichanDicts,
  searchResult,
  setSearchResult,
}) => {
  const params = useParams();
  const { searchmode = "", search = "" } = params;
  const history = useHistory();
  const searchInputRef = useRef();

  const [searchLoading, setSearchLoading] = useState();
  const [searchInputText, setSearchInputText] = useState(search);

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
  }, [dicts, yomichanDicts, searchmode, search]);

  const applySearchToUrl = () => {
    if (search !== searchInputText && dicts?.length) {
      // if a new search is made, go to the lookup page
      const lookupUrl = generatePath(urls.lookup, {
        dictname: currentDict || dicts?.[0],
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

    const [yomiSearchPromise, apiSearchPromises] = searchYomichanAndApi(
      word,
      db,
      yomichanDicts,
      dicts
    );

    yomiSearchPromise?.then((dictsAndResults) => {
      Object.entries(dictsAndResults || {}).forEach(
        ([dictAlias, resultObject]) => {
          const { alias, word, result, error } = resultObject;
          singleDictSearchResult(alias, word, result, error);
        }
      );
    });
    apiSearchPromises?.map((p) =>
      p?.then((resultObject) => {
        const { alias, word, result, error } = resultObject;
        singleDictSearchResult(alias, word, result, error);
      })
    );

    return Promise.allSettled([
      yomiSearchPromise,
      ...apiSearchPromises,
    ]).finally(() => setSearchLoading(false));
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
          autoFocus={search?.length === 0}
          searchLoading={searchLoading}
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
