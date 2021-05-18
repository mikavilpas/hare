import Container from "react-bootstrap/Container";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";

import Dictionaries from "./Dictionaries";
import SearchBox from "./SearchBox";
import Definitions from "./Definitions";

function DictView() {
  const [dicts, setDicts] = useState([]);
  const [currentDict, setCurrentDict] = useState("");
  const [searchLoading, setSearchLoading] = useState();
  const [searchResult, setSearchResult] = useState({});

  const { dictname } = useParams();
  useEffect(() => {
    if (dictname !== currentDict) {
      setCurrentDict(dictname);
    }
  }, [dictname]);

  return (
    <>
      <div className="mt-3"></div>
      <SearchBox
        dicts={dicts}
        searchResult={searchResult}
        setSearchResult={setSearchResult}
        setSearchLoading={setSearchLoading}
      />
      <Dictionaries
        currentDict={currentDict}
        dicts={dicts}
        setDicts={setDicts}
        searchResult={searchResult}
      />
      <main className="mt-3">
        <Definitions
          dict={currentDict}
          searchResult={searchResult}
          searchLoading={searchLoading}
        />
      </main>
    </>
  );
}

export default DictView;
