import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { getDicts } from "./api";
import "./App.css";
import { startGoogleAnalytics } from "./telemetry";
import { initFrequencyList } from "./utils/frequency";
import { newDatabaseWorkerInstance } from "./utils/yomichan/workers/databaseWorker";
import DictView from "./views/dict/";
import { dictShortName, preferredDictionaries } from "./views/dict/utils";
import ExportView from "./views/export/ExportView";
import GrammarView from "./views/grammar/GrammarView";
import SettingsView from "./views/help/SettingsView";
import VersionIndicator from "./views/versionIndicator/VersionIndicator";

// these settings are stored in the database
const defaultAnkiConnectSettings = {
  address: new URL("http://127.0.0.1:8765"),
  selectedDeckName: "",
  selectedModelName: "",
  fieldValueMapping: {},
};

function App() {
  const [searchLoading, setSearchLoading] = useState();
  const [searchResult, setSearchResult] = useState();
  const [searchError, setSearchError] = useState();

  const [dicts, setDicts] = useState([]);
  const [dictsLoading, setDictsLoading] = useState(false);
  const [dictsLoadingError, setDictsLoadingError] = useState();

  // The worker thread for yomichan database interaction. The fact that this is
  // a worker thread is likely irrelevant for many components, so they might
  // refer to it simply as "db"
  const yomichanDbWorker = useRef();
  const [yomichanDicts, setYomichanDicts] = useState([]);
  const [yomichanDictsAndSettings, setYomichanDictsAndSettings] = useState([]);

  const [ankiConnectSettings, setAnkiConnectDbSettings] = useState(
    defaultAnkiConnectSettings
  );

  const updateAnkiConnectSettingsToDb = async (newSettings) => {
    const db = yomichanDbWorker.current;
    if (!db) return;

    for (let [key, value] of Object.entries(newSettings)) {
      await db.saveAnkiConnectSetting(key, value);
    }

    await db
      .getAnkiConnectSettings()
      .then((settingsResponse) =>
        setAnkiConnectDbSettings(settingsResponse.data)
      );
  };

  useEffect(() => {
    startGoogleAnalytics();
    initFrequencyList();

    newDatabaseWorkerInstance().then((worker) => {
      // initialize the worker thread only once so there is no resource leakage
      yomichanDbWorker.current = worker;
      worker.getDictionaries().then((ds) => setYomichanDicts(ds));
      worker.getDictionariesAndSettings().then((ds) => {
        setYomichanDictsAndSettings(ds);
      });
      worker
        .getAnkiConnectSettings()
        .then((settingsResponse) =>
          setAnkiConnectDbSettings(settingsResponse.data)
        );
    });
  }, []);

  useEffect(() => {
    setDictsLoading(true);
    getDicts()
      .then(([response, error]) => {
        const whitelist = new Set(preferredDictionaries);
        const shortNames = response?.map((d) => dictShortName(d));
        const whitelistedDictionaries = shortNames.filter((n) =>
          whitelist.has(n)
        );
        setDicts(whitelistedDictionaries);
        // setDict(currentDict || whitelistedDictionaries?.[0]);
        setDictsLoadingError(error);
      })
      .catch((e) => {
        setDictsLoadingError(e);
      })
      .finally(() => setDictsLoading(false));
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
              <DictView
                dicts={dicts}
                setDicts={setDicts}
                db={yomichanDbWorker.current}
                yomichanDicts={yomichanDicts}
                yomichanDictsAndSettings={yomichanDictsAndSettings}
                dictsLoading={dictsLoading}
                dictsLoadingError={dictsLoadingError}
              />
            </Route>
            <Route path={["/export/:dictname/:searchmode/:search/:openeditem"]}>
              <ExportView
                dicts={dicts}
                db={yomichanDbWorker.current}
                yomichanDicts={yomichanDicts}
                ankiConnectSettings={ankiConnectSettings}
              />
            </Route>
            <Route path={["/grammar"]}>
              <GrammarView />
            </Route>
            <Route path={["/settings"]}>
              <SettingsView
                ankiConnectSettings={ankiConnectSettings}
                setAnkiConnectSettings={updateAnkiConnectSettingsToDb}
                db={yomichanDbWorker.current}
                yomichanDictsAndSettings={yomichanDictsAndSettings}
                refreshYomichanDictsAndSettings={() => {
                  yomichanDbWorker.current
                    ?.getDictionaries()
                    .then((ds) => setYomichanDicts(ds));
                  yomichanDbWorker.current
                    ?.getDictionariesAndSettings()
                    .then((ds) => setYomichanDictsAndSettings(ds));
                }}
              />
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
