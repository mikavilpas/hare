import { useEffect, useRef, useState } from "react";
import {
  generatePath,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import { pageView } from "../../telemetry";
import Navbar from "../navbar/Navbar";
import RecursiveLookup from "../recursiveLookup/index";
import Definitions from "./Definitions";
import Dictionaries from "./Dictionaries";
import SearchBox from "./SearchBox";
import { registerGestures } from "./gestures";
import { dictInfo, urls } from "./utils";

const defaultYomiDict = (yomichanDictsAndSettings) => {
  if (!yomichanDictsAndSettings?.length) return null;

  const before = yomichanDictsAndSettings.filter(
    (ds) => ds.setting.positionType === "before"
  );
  before.sort((a, b) => a.setting.position - b.setting.position);

  // in case the user has no "before" dictionaries, we let the caller fallback
  // to a default
  if (before.length === 0) return null;

  const { dictionary } = before[0];
  return dictionary;
};

function DictView({
  dicts,
  setDicts,
  db,
  yomichanDicts,
  yomichanDictsAndSettings,
  dictsLoading,
  dictsLoadingError,
}) {
  const [searchResult, setSearchResult] = useState({});

  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();

  const { dictname } = useParams();

  const gestureRef = useRef();

  useEffect(() => {
    const dict = match?.params?.dictname;
    pageView("dict", `#/${dict}`);
  }, [match?.params?.dictname]);

  useEffect(() => {
    if (
      match.path === urls.recursiveLookup &&
      location.pathname !== match.url
    ) {
      goToRecursiveLookupPage(match.params.rsearch, match.params.rdict);
    }
  }, [match.params, match.path]);

  useEffect(() => {
    if (dicts || yomichanDicts?.length > 0) {
      const unregister = registerGestures(gestureRef.current);
      return unregister;
    }
  }, [dicts, yomichanDicts]);

  const goToRecursiveLookupPage = (
    word,
    dict = defaultYomiDict(yomichanDictsAndSettings)?.alias || "大辞林"
  ) => {
    const url = generatePath(urls.recursiveLookup, {
      ...match.params,
      rdict: dict,
      rsearchmode: "prefix",
      rsearch: word,
      ropeneditem: 0, // open first search result
    });
    history.push(url);
  };

  const currentDefinitions = () => {
    if (!dictname) return null;

    const dictinfo = dictInfo(dictname);
    if (dictinfo) {
      const result =
        searchResult?.[dictinfo?.id]?.result ||
        searchResult?.[dictinfo?.alias]?.result;
      return result;
    } else {
      // yomichan dictionary
      return searchResult?.[dictname]?.result;
    }
  };

  const p = match?.params;
  const makeExportLink = () =>
    `/export/${p?.dictname}/${p?.searchmode}/${p?.search}/${p?.openeditem}`;

  return (
    <div ref={gestureRef}>
      <Navbar>
        <SearchBox
          currentDict={dictname}
          dicts={dicts}
          db={db}
          yomichanDicts={yomichanDicts}
          searchResult={searchResult}
          setSearchResult={setSearchResult}
        />
      </Navbar>
      <div className="mt-3"></div>
      <Dictionaries
        currentDict={dictname}
        dicts={dicts}
        setDicts={setDicts}
        yomichanDictsAndSettings={yomichanDictsAndSettings}
        searchResult={searchResult}
        loading={dictsLoading}
        error={dictsLoadingError}
      />
      <main className="mt-3">
        <Definitions
          dict={dictname}
          definitions={currentDefinitions()}
          goToRecursiveLookupPage={goToRecursiveLookupPage}
          currentTab={match.params.openeditem}
          openTab={(index) => {
            const url = generatePath(match.path, {
              ...match.params,
              openeditem: index,
            });
            history.push(url);
          }}
          makeExportLink={makeExportLink}
        />
      </main>
      <RecursiveLookup
        yomichanDicts={yomichanDicts}
        db={db}
        goToRecursiveLookupPage={goToRecursiveLookupPage}
        hide={() => {
          const dictUrl = generatePath(urls.lookup, match.params);
          history.push(dictUrl);
        }}
      />
    </div>
  );
}

export default DictView;
