import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import "./App.css";
import { startGoogleAnalytics } from "./telemetry";
import { initFrequencyList } from "./utils/frequency";
import DictView from "./views/dict/";
import ExportView from "./views/export/ExportView";
import SettingsView from "./views/help/SettingsView";
import VersionIndicator from "./views/versionIndicator/VersionIndicator";

function App() {
  const [searchLoading, setSearchLoading] = useState();
  const [searchResult, setSearchResult] = useState();
  const [searchError, setSearchError] = useState();

  useEffect(() => {
    startGoogleAnalytics();
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
            <Route path={["/settings"]}>
              <SettingsView />
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
