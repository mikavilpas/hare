import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Container from "react-bootstrap/Container";
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import DictView from "./views/dict/";

function App() {
  const [dict, setDict] = useState("");
  const [searchLoading, setSearchLoading] = useState();
  const [searchResult, setSearchResult] = useState();
  const [searchError, setSearchError] = useState();

  return (
    <div className="App">
      <Container fluid>
        <Router>
          <Switch>
            <Route path="/dict">
              <DictView />
            </Route>
            <Route path="/">
              <Redirect to="/dict" />
            </Route>
          </Switch>
        </Router>
      </Container>
    </div>
  );
}

export default App;
