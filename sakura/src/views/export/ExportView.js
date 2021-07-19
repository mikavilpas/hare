import copy from "copy-to-clipboard";
import ReactDOM from "react-dom";
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
import Navbar from "../navbar/Navbar";
import ExportViewDefinitionTokenProcessor from "../dict/tokenProcessors/exportViewDefinitionTokenProcessor";

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

const SearchLink = ({ icon, children, url }) => {
  return (
    <a
      className="external-site d-flex align-items-center mb-2"
      rel="noopener noreferrer"
      target="_blank"
      href={url}
    >
      {icon}
      &nbsp;
      <span style={{ wordBreak: "keep-all" }} className="ml-2 ">
        {children}
      </span>
    </a>
  );
};

const SearchLinkWithIcon = ({ iconUrl, children, url }) => {
  const icon = (
    <img
      src={iconUrl}
      style={{ height: "16px", width: "16px" }}
      className="inline icon"
    ></img>
  );
  return <SearchLink icon={icon} children={children} url={url} />;
};

const CopyQuoteButton = ({ text, selectedWord }) => {
  const [wordWasCopied, setWordWasCopied] = useState(false);

  const copiableText = text
    ?.replace("―", selectedWord)
    .replace("━", selectedWord);

  return (
    <Button
      variant={wordWasCopied ? "outline-success" : "outline-secondary"}
      size="sm"
      onClick={() => {
        copy(copiableText);
        setWordWasCopied(true);
      }}
    >
      {wordWasCopied ? (
        <span>
          <i className="bi bi-file-check"></i>
        </span>
      ) : (
        <span>
          <i className="bi bi-files"></i>
        </span>
      )}
    </Button>
  );
};

const ExportView = ({}) => {
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState();
  const [searchError, setSearchError] = useState();
  const [definitionNode, setDefinitionNode] = useState();

  const match = useRouteMatch();
  const dict = match.params.dictname;
  const search = match.params.search;
  const openeditem = match.params.openeditem;

  const [copiableText, setCopiableText] = useState();
  const [wordOptions, setWordOptions] = useState([]);
  const [selectedWord, setSelectedWord] = useState();
  const buttonsRef = useRef();

  useEffect(() => {
    pageView("export", `/${dict}`);

    return function cleanup() {
      buttonsRef.current?.forEach((b) => {
        ReactDOM.unmountComponentAtNode(b);
      });
    };
  }, []);

  const onRefChange = (node) => {
    // add copy button to example sentences
    setDefinitionNode(node);

    if (!node) return;

    const quoteActions = Array.from(node.querySelectorAll(".quote-actions"));
    quoteActions.forEach((q) => {
      ReactDOM.render(
        <CopyQuoteButton text={q.dataset.quote} selectedWord={selectedWord} />,
        q
      );
    });
    buttonsRef.current = quoteActions;
  };

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

            options.sort((a, b) => frequency(b)?.rating - frequency(a)?.rating);
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
  const bodyHtml = prettyText(searchResult.text, {
    dict: dict,
    createTokenProcessor: (args) =>
      new ExportViewDefinitionTokenProcessor(args),
  });

  return (
    <Container fluid id="export" className="mt-2">
      <Navbar>
        <h3>辞典内容を共有する</h3>
      </Navbar>
      <Row id="definition-preview" className="d-flex flex-column h-50 mt-3">
        <div className="card">
          <div className="card-body" ref={onRefChange}>
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
                  const text = definitionNode?.innerText
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
            <Col>
              <ul className="external-sites list-unstyled mt-2">
                <li>
                  <SearchLinkWithIcon
                    word={selectedWord}
                    iconUrl={"/dict/icons/google.png"}
                    url={`https://www.google.co.jp/search?tbm=isch&q=${selectedWord}`}
                  >
                    Google 画像
                  </SearchLinkWithIcon>
                </li>
                <li>
                  <SearchLinkWithIcon
                    word={selectedWord}
                    iconUrl={"/dict/icons/google.png"}
                    url={`https://www.google.co.jp/search?tbm=isch&q=${selectedWord} イラスト`}
                  >
                    Google イラスト
                  </SearchLinkWithIcon>
                </li>
                <li>
                  <SearchLinkWithIcon
                    word={selectedWord}
                    iconUrl={"/dict/icons/jisho.png"}
                    url={`https://jisho.org/search/${selectedWord}`}
                  >
                    Jisho
                  </SearchLinkWithIcon>
                </li>
                <li>
                  <SearchLinkWithIcon
                    word={selectedWord}
                    iconUrl={"https://youglish.com/images/brandyg.png"}
                    url={`https://youglish.com/pronounce/${selectedWord}/japanese?`}
                  >
                    Youglish
                  </SearchLinkWithIcon>
                </li>
              </ul>
            </Col>
            <Col>
              <ul className="external-sites list-unstyled mt-2">
                <li>
                  <SearchLink
                    word={selectedWord}
                    icon={
                      <i
                        style={{ fontSize: "medium" }}
                        className="bi bi-book"
                      ></i>
                    }
                    url={`http://yourei.jp/${selectedWord}`}
                  >
                    Yourei sentences
                  </SearchLink>
                </li>
                <li>
                  <SearchLinkWithIcon
                    word={selectedWord}
                    iconUrl={"/dict/icons/jisho.png"}
                    url={`https://jisho.org/search/${selectedWord}%20%23sentences`}
                  >
                    Jisho sentences
                  </SearchLinkWithIcon>
                </li>
                <li>
                  <SearchLinkWithIcon
                    word={selectedWord}
                    iconUrl={"https://sentencesearch.neocities.org/favicon.png"}
                    url={`https://sentencesearch.neocities.org/#${selectedWord}`}
                  >
                    Audio sentences
                  </SearchLinkWithIcon>
                </li>
                <li>
                  <SearchLink
                    word={selectedWord}
                    icon={
                      <i
                        style={{ fontSize: "medium", color: "#7952b3" }}
                        className="bi bi-square-fill"
                      ></i>
                    }
                    url={`https://immersionkit.com/dictionary?keyword=${selectedWord}`}
                  >
                    Immersion Kit
                  </SearchLink>
                </li>
              </ul>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default ExportView;
