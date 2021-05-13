import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Dictionaries from "./Dictionaries";
import SearchBox from "./SearchBox";
import Container from "react-bootstrap/Container";
import React, { useState } from "react";

function App() {
  const [dict, setDict] = useState("");
  const [searchResult, setSearchResult] = useState();
  const [searchError, setSearchError] = useState();

  return (
    <div className="App">
      <Container fluid>
        <SearchBox
          dict={dict}
          setSearchResult={setSearchResult}
          setSearchError={setSearchError}
        />
        <Dictionaries setDict={setDict} />
      </Container>
    </div>
  );
}

export default App;
