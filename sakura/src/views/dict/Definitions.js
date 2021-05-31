import Alert from "react-bootstrap/Alert";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Spinner from "react-bootstrap/Spinner";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

import React, { useState, useEffect } from "react";

import { getDicts, textAnalysis } from "../../api";
import config from "../../config";

import {
  Link,
  useHistory,
  useParams,
  useRouteMatch,
  generatePath,
  useLocation,
} from "react-router-dom";
import {
  dictInfo,
  urls,
  bbcode2Text,
  prettifyLines,
  prettyText,
} from "./utils";
import RecursiveLookup from "../recursiveLookup/index";
import { frequency } from "../../utils/frequency";
import { parse } from "../../utils/wordParser";

const Definition = ({
  i,
  definition,
  openTab,
  goToRecursiveLookupPage,
  isOpened,
  makeExportLink,
}) => {
  // always open the first card by default
  const [analysisResult, setAnalysisResult] = useState();
  const [analysisError, setAnalysisError] = useState();
  const [definitionWords, setDefinitionWords] = useState([]);
  const [currentFrequency, setCurrentFrequency] = useState(0);
  const [currentOrderNumber, setCurrentOrderNumber] = useState();
  const match = useRouteMatch();
  const history = useHistory();

  useEffect(() => {
    // parse the words from the current definition's heading
    try {
      const wordAnalysis = parse(definition?.heading);
      const words = [
        wordAnalysis.value.kana,
        ...wordAnalysis.value.kanjiOptions,
      ].filter((w) => w);
      setDefinitionWords(words);
    } catch (e) {
      console.warn("Unable to parse definition words", e);
      setDefinitionWords([]);
    }
  }, [definition.heading]);

  useEffect(() => {
    const frequencies = definitionWords.map(frequency);

    const highestFrequency = frequencies
      .filter((f) => f) // might not have been loaded yet - just ignore
      .map((f) => f.rating)
      .sort()
      .reverse()?.[0];

    if (highestFrequency === 5) setCurrentOrderNumber(1);
    else if (highestFrequency === 4) setCurrentOrderNumber(2);
    else if (highestFrequency === 3) setCurrentOrderNumber(3);
    else if (highestFrequency === 2) setCurrentOrderNumber(4);
    else if (highestFrequency === 1) setCurrentOrderNumber(5);
    else setCurrentOrderNumber(6); // don't change the ordering

    setCurrentFrequency(highestFrequency);
  }, [definitionWords]);

  const getTextAnalysis = () => {
    if (isOpened && definition?.text) {
      // successive api calls get cached
      const text = bbcode2Text(definition.text);
      textAnalysis(text).then(([html, error]) => {
        setAnalysisResult(html);
        setAnalysisError(error);
      });
    }
  };

  useEffect(() => {
    getTextAnalysis();
  }, [isOpened, definition]);

  const toolbar = () => {
    const { rdict, rsearchmode, rsearch } = match.params;
    return (
      <ButtonGroup
        size="lg"
        className="definition-toolbar align-items-center"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          return false;
        }}
      >
        <DropdownButton title="検索" variant="secondary" size="sm">
          {definitionWords.map((w, i) => {
            const href = generatePath(urls.lookup, {
              ...match.params,
              search: w,
              openeditem: "0",
            });
            return (
              <Dropdown.Item as={Link} to={href} key={i}>
                {w}
              </Dropdown.Item>
            );
          })}
        </DropdownButton>
        <Button
          as={Link}
          className="icon-button"
          variant="link"
          to={makeExportLink()}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <i className="bi bi-link"></i>
        </Button>
      </ButtonGroup>
    );
  };

  return (
    <Card
      key={i}
      className={currentOrderNumber > 0 ? `order-${currentOrderNumber}` : ""}
    >
      <Accordion.Toggle
        as={Card.Header}
        onClick={(e) => {
          if (isOpened) openTab("-");
          else openTab(i.toString());
          return false;
        }}
        eventKey={i.toString()}
      >
        <div className="d-flex justify-content-between align-items-center">
          <span className="definition-title d-flex justify-content-between w-100 align-items-center">
            <span
              dangerouslySetInnerHTML={{
                __html: bbcode2Text(definition?.heading),
              }}
            ></span>
            {/* words that are not included in the frequency list do not get
                displayed at all - this will allow for quick visual scanning */}
            {currentFrequency > 0 && (
              <span className="badge badge-secondary">{currentFrequency}</span>
            )}
          </span>
          {isOpened && toolbar()}
        </div>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={i.toString()}>
        <Card.Body>
          <div
            onClick={(e) => {
              const wordFromKanji = e?.target?.parentElement?.dataset?.word;
              const wordFromKana = e?.target?.dataset?.word;
              const word = wordFromKanji || wordFromKana;
              if (word) {
                goToRecursiveLookupPage(word);
              }
            }}
            dangerouslySetInnerHTML={{
              __html: prettyText(analysisResult || definition?.text),
            }}
          ></div>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
};

const Definitions = ({
  dict,
  definitions,
  searchError,
  searchLoading,
  goToRecursiveLookupPage,
  currentTab,
  openTab,
  makeExportLink,
}) => {
  if (searchLoading) {
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  } else if (searchError) {
    return (
      <Alert variant={"danger"}>
        <p>Error loading results</p>
        <p>{searchError.toString()}</p>
      </Alert>
    );
  }

  if (!definitions) return "";

  return (
    <Accordion
      activeKey={currentTab}
      className="definition-listing d-flex flex-column"
    >
      {definitions.words?.map((w, i) => {
        return (
          <Definition
            key={`${dict}_${i}`}
            i={i}
            openTab={openTab}
            definition={w}
            goToRecursiveLookupPage={goToRecursiveLookupPage}
            isOpened={i.toString() === currentTab}
            makeExportLink={makeExportLink}
          />
        );
      })}
    </Accordion>
  );
};

export default Definitions;
