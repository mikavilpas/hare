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
  const [searchLoading, setSearchLoading] = useState();
  const [searchResult, setSearchResult] = useState();
  const [searchError, setSearchError] = useState();

  return (
    <div className="App">
      <Container fluid>
        <Router>
          <Switch>
            <Route
              path={[
                // these are all the main states the app can be in.

                // normal + recursive search opened
                "/dict/:dictname/:searchmode/:search/recursive/:rdict/:rsearchmode/:rsearch",

                // normal search opened
                "/dict/:dictname/:searchmode/:search",

                // dict selected but no search yet
                "/dict/:dictname",

                // no dict selected yet
                "/dict",
              ]}
            >
              <DictView />
            </Route>
            <Route>
              <Redirect to="/dict" />
            </Route>
          </Switch>
        </Router>
      </Container>
    </div>
  );
}

export default App;
