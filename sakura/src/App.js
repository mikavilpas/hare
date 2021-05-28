import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import Container from "react-bootstrap/Container";
import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import DictView from "./views/dict/";
import VersionIndicator from "./views/versionIndicator/VersionIndicator";
import ExportView from "./views/export/ExportView";
import { initFrequencyList } from "./utils/frequency";

function App() {
  const [searchLoading, setSearchLoading] = useState();
  const [searchResult, setSearchResult] = useState();
  const [searchError, setSearchError] = useState();

  useEffect(() => {
    initFrequencyList();
  }, []);

  return (
    <div className="App">
      <Container fluid>
        <Router>
          <Switch>
            <Route
              path={[
                // these are all the main states the dict view can be in.

                // normal + recursive search opened
                "/dict/:dictname/:searchmode/:search/:openeditem/recursive/:rdict/:rsearchmode/:rsearch/:ropeneditem",

                // normal search opened
                "/dict/:dictname/:searchmode/:search/:openeditem",

                // dict selected but no search yet
                "/dict/:dictname",

                // no dict selected yet
                "/dict",
              ]}
            >
              <DictView />
            </Route>
            <Route path={["/export/:dictname/:searchmode/:search/:openeditem"]}>
              <ExportView />
            </Route>
            <Route>
              <Redirect to="/dict" />
            </Route>
          </Switch>
        </Router>
        <VersionIndicator />
      </Container>
    </div>
  );
}

export default App;
