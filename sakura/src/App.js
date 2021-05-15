import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Dictionaries from "./Dictionaries";
import SearchBox from "./SearchBox";
import Container from "react-bootstrap/Container";
import React, { useState } from "react";
import Definitions from "./Definitions";

function App() {
  const [dict, setDict] = useState("");
  const [searchResult, setSearchResult] = useState();
  const [searchError, setSearchError] = useState();

  return (
    <div className="App">
      <Container fluid>
        <div className="mt-3"></div>
        <SearchBox
          dict={dict}
          setSearchResult={setSearchResult}
          setSearchError={setSearchError}
        />
        <Dictionaries setDict={setDict} />
        <main className="mt-3">
          <Definitions dict={dict} searchResult={searchResult} />
        </main>
      </Container>
    </div>
  );
}

export default App;
