import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Spinner from "react-bootstrap/Spinner";
import Tooltip from "react-bootstrap/Tooltip";
import {
  generatePath,
  Link,
  useHistory,
  useRouteMatch,
} from "react-router-dom";
import { textAnalysis } from "../../api";
import { frequency } from "../../utils/frequency";
import { parse } from "../../utils/wordParser";
import { bbcode2Html, prettyText, urls, postProcessDefinition } from "./utils";

const Frequency = ({ rating }) => {
  const explanation = () => {
    if (rating === 5) return "extremely common";
    if (rating === 4) return "very common";
    if (rating === 3) return "common";
    if (rating === 2) return "somewhat rare";
    if (rating === 1) return "rare";
    else return "unknown";
  };

  if (rating <= 0) return "";

  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip id="button-tooltip">
          The frequency of the word is {rating}/5 <b>({explanation()})</b>
        </Tooltip>
      }
    >
      <span
        onClick={(e) => e.stopPropagation()}
        className="badge badge-secondary"
      >
        {rating}
      </span>
    </OverlayTrigger>
  );
};

const Definition = ({
  i,
  definition,
  openTab,
  goToRecursiveLookupPage,
  isOpened,
  makeExportLink,
}) => {
  const match = useRouteMatch();
  const history = useHistory();

  // always open the first card by default
  const [analysisResult, setAnalysisResult] = useState();
  const [analysisError, setAnalysisError] = useState();
  const [definitionHtml, setDefinitionHtml] = useState(
    prettyText(definition?.text || "", {
      dict: match.params.dictname,
    })
  );

  const [definitionWords, setDefinitionWords] = useState([]);
  const [currentFrequency, setCurrentFrequency] = useState(0);
  const [currentOrderNumber, setCurrentOrderNumber] = useState();
  const [furiganaEnabled, setFuriganaEnabled] = useState(false);

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
    if (isOpened && definitionHtml) {
      // successive api calls get cached
      textAnalysis(definitionHtml).then(([html, error]) => {
        setAnalysisResult(html);
        setAnalysisError(error);
      });
    }
  };

  useEffect(() => {
    getTextAnalysis();
  }, [isOpened, definition]);

  const toolbar = () => {
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

            const freq = frequency(w)?.rating || 0;
            return (
              <Dropdown.Item as={Link} to={href} key={i}>
                {w} {"★".repeat(freq)}
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
                __html: bbcode2Html(definition?.heading),
              }}
            ></span>
            {/* words that are not included in the frequency list do not get
                displayed at all - this will allow for quick visual scanning */}
            <Frequency rating={currentFrequency} />
          </span>
          {isOpened && toolbar()}
        </div>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={i.toString()}>
        <Card.Body>
          <Button
            variant="outline-secondary"
            className="float-right"
            onClick={() => setFuriganaEnabled(!furiganaEnabled)}
          >
            振
          </Button>
          <div
            className={furiganaEnabled ? "furigana-shown" : "furigana-hidden"}
            onClick={(e) => {
              const wordFromKanji = e?.target?.parentElement?.dataset?.word;
              const wordFromKana = e?.target?.dataset?.word;
              const word = wordFromKanji || wordFromKana;
              if (word) {
                goToRecursiveLookupPage(word);
              }
            }}
            dangerouslySetInnerHTML={{
              __html: analysisResult || definitionHtml,
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
