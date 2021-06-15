import copy from "copy-to-clipboard";
import React, { useEffect, useRef, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import { useRouteMatch } from "react-router-dom";
import { getWordDefinitions } from "../../api";
import { pageView } from "../../telemetry";
import { frequency } from "../../utils/frequency";
import * as wordParser from "../../utils/wordParser";
import { prettyText } from "../dict/utils";

const CopyButton = ({ getTextToCopy, buttonText }) => {
  const [wordWasCopied, setWordWasCopied] = useState(false);

  return (
    <Button
      block
      className="mt-2"
      variant={wordWasCopied ? "outline-success" : "outline-primary"}
      onClick={() => {
        const text = getTextToCopy();
        copy(text);
        setWordWasCopied(true);
      }}
    >
      {wordWasCopied ? (
        <span>
          {buttonText} <i className="bi bi-check fs-1"></i>
        </span>
      ) : (
        <span>{buttonText}</span>
      )}
    </Button>
  );
};

const SearchLink = ({ iconUrl, children, url }) => {
  return (
    <a
      className="external-site"
      rel="noopener noreferrer"
      target="_blank"
      href={url}
    >
      <img
        src={iconUrl}
        style={{ height: "16px", width: "16px" }}
        className="inline icon"
      ></img>
      &nbsp;
      {children}
    </a>
  );
};

const ExportView = ({}) => {
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState();
  const [searchError, setSearchError] = useState();
  const definitionRef = useRef();

  const match = useRouteMatch();
  const dict = match.params.dictname;
  const search = match.params.search;
  const openeditem = match.params.openeditem;

  const [copiableText, setCopiableText] = useState();
  const [wordOptions, setWordOptions] = useState([]);
  const [selectedWord, setSelectedWord] = useState();
  const [wordWasCopied, setWordWasCopied] = useState();

  useEffect(() => {
    pageView("export", `/${dict}`);
  }, []);

  useEffect(() => {
    if (!dict || !search || !openeditem) {
      setSearchResult(null);
      setSearchError(
        "Invalid search parameters. Please go back and try again."
      );
      return;
    }

    setLoading(true);
    getWordDefinitions({ dict: dict, word: search })
      .then(([result, error]) => {
        const searchResultItem = result?.words?.[openeditem];
        if (!searchResultItem) {
          setSearchError("the search result did not contain the searched word");
          setSearchResult(null);
        } else {
          setSearchResult(searchResultItem);
          setSearchError(error);

          // parse possible words
          try {
            const parseResult = wordParser.parse(searchResultItem.heading);
            const options = [
              ...parseResult.value.kanjiOptions,
              parseResult.value.kana,
              searchResultItem.heading,
            ];
            setWordOptions(options);
            setSelectedWord(options?.[0]);
          } catch (e) {
            console.warn(
              "Could not parse this word. Please report a bug with the current url.",
              searchResultItem.heading
            );
            // fall back to just the unexpected input as the selection
            setWordOptions([searchResultItem.heading]);
            setSelectedWord(searchResultItem.heading);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [match.params]);

  if (searchError) {
    return <Alert variant="danger">Error: {searchError}</Alert>;
  }
  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }

  if (!searchResult) {
    return "";
  }

  const headingHtml = prettyText(searchResult.heading, { dict: dict });
  const bodyHtml = prettyText(searchResult.text, { dict: dict });

  return (
    <Container id="export" className="mt-2">
      <h3>辞典内容を共有する</h3>
      <Row id="definition-preview" className="d-flex flex-column h-50">
        <div className="card">
          <div className="card-body" ref={definitionRef}>
            <h3
              className="card-title"
              dangerouslySetInnerHTML={{
                __html: headingHtml,
              }}
            ></h3>
            <p
              className="card-text"
              dangerouslySetInnerHTML={{
                __html: bodyHtml,
              }}
            ></p>
          </div>
        </div>
      </Row>
      {wordOptions?.length > 0 && (
        <>
          <Row className="mt-2">
            <h6>外部サイトで「{selectedWord}」を検索 </h6>
            <Form.Control
              as="select"
              custom
              value={selectedWord}
              onChange={(e) => setSelectedWord(e.target.value)}
            >
              {wordOptions.map((w, i) => {
                const freq = frequency(w)?.rating || 0;
                return (
                  <option value={w} key={i}>
                    {w} {"★".repeat(freq)}
                  </option>
                );
              })}
            </Form.Control>
          </Row>
          <Row className="mt-2">
            <Col>
              <CopyButton
                buttonText="TXTをコピー"
                getTextToCopy={() => {
                  const text = definitionRef.current?.innerText
                    ?.split("\n")
                    .filter((l) => l.length > 0)
                    .join("\n");
                  return text;
                }}
              />
            </Col>
            <Col>
              <CopyButton
                buttonText="Copy word"
                getTextToCopy={() => selectedWord}
              />
            </Col>
          </Row>
          <Row>
            <ul className="external-sites list-unstyled mt-2">
              <li>
                <SearchLink
                  word={selectedWord}
                  iconUrl={"/dict/icons/google.png"}
                  url={`https://www.google.co.jp/search?tbm=isch&q=${selectedWord}`}
                >
                  Google 画像
                </SearchLink>
              </li>
              <li>
                <SearchLink
                  word={selectedWord}
                  iconUrl={"/dict/icons/google.png"}
                  url={`https://www.google.co.jp/search?tbm=isch&q=${selectedWord} イラスト`}
                >
                  Google イラスト
                </SearchLink>
              </li>
              <li>
                <SearchLink
                  word={selectedWord}
                  iconUrl={"/dict/icons/jisho.png"}
                  url={`https://jisho.org/search/${selectedWord}%20%23sentences`}
                >
                  Jisho sentences
                </SearchLink>
              </li>
              <li>
                <SearchLink
                  word={selectedWord}
                  iconUrl={"/dict/icons/jisho.png"}
                  url={`https://jisho.org/search/${selectedWord}`}
                >
                  Jisho
                </SearchLink>
              </li>
              <li>
                <SearchLink
                  word={selectedWord}
                  iconUrl={"https://sentencesearch.neocities.org/favicon.png"}
                  url={`https://sentencesearch.neocities.org/#${selectedWord}`}
                >
                  Audio sentences
                </SearchLink>
              </li>
            </ul>
          </Row>
        </>
      )}
    </Container>
  );
};

export default ExportView;
