import Container from "react-bootstrap/Container";
import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Dictionaries from "./Dictionaries";
import SearchBox from "./SearchBox";
import Definitions from "./Definitions";

function DictView() {
  const [dict, setDict] = useState("");
  const [searchLoading, setSearchLoading] = useState();
  const [searchResult, setSearchResult] = useState();
  const [searchError, setSearchError] = useState();

  return (
    <>
      <div className="mt-3"></div>
      <SearchBox
        dict={dict}
        setSearchResult={setSearchResult}
        setSearchError={setSearchError}
        setSearchLoading={setSearchLoading}
      />
      <Dictionaries setDict={setDict} />
      <main className="mt-3">
        <Definitions
          dict={dict}
          searchResult={searchResult}
          searchError={searchError}
          searchLoading={searchLoading}
        />
      </main>
    </>
  );
}

export default DictView;
