import Container from "react-bootstrap/Container";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  generatePath,
  useParams,
  useLocation,
  useHistory,
  useRouteMatch,
} from "react-router-dom";

import Dictionaries from "./Dictionaries";
import SearchBox from "./SearchBox";
import Definitions from "./Definitions";
import { dictInfo, urls } from "./utils";
import RecursiveLookup from "../recursiveLookup/index";

function DictView() {
  const [dicts, setDicts] = useState([]);
  const [searchLoading, setSearchLoading] = useState();
  const [searchResult, setSearchResult] = useState({});

  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();

  const { dictname } = useParams();

  useEffect(() => {
    if (
      match.path === urls.recursiveLookup &&
      location.pathname !== match.url
    ) {
      goToRecursiveLookupPage(match.params.rsearch, match.params.rdict);
    }
  }, [match]);

  const goToRecursiveLookupPage = (word, dict = "大辞林") => {
    const url = generatePath(urls.recursiveLookup, {
      ...match.params,
      rdict: dict,
      rsearchmode: "prefix",
      rsearch: word,
    });
    history.push(url);
  };

  const currentDefinitions = () => {
    if (!dictname) return null;

    const dictinfo = dictInfo(dictname);
    const result =
      searchResult?.[dictinfo.id]?.result ||
      searchResult?.[dictinfo.alias]?.result;
    return result;
  };

  return (
    <>
      <div className="mt-3"></div>
      <SearchBox
        currentDict={dictname}
        dicts={dicts}
        searchResult={searchResult}
        setSearchResult={setSearchResult}
        setSearchLoading={setSearchLoading}
      />
      <Dictionaries
        currentDict={dictname}
        dicts={dicts}
        setDicts={setDicts}
        searchResult={searchResult}
      />
      <main className="mt-3">
        <Definitions
          dict={dictname}
          definitions={currentDefinitions()}
          searchLoading={searchLoading}
          goToRecursiveLookupPage={goToRecursiveLookupPage}
        />
      </main>
      <RecursiveLookup
        goToRecursiveLookupPage={goToRecursiveLookupPage}
        hide={() => {
          const dictUrl = generatePath(urls.lookup, match.params);
          history.push(dictUrl);
        }}
      />
    </>
  );
}

export default DictView;
