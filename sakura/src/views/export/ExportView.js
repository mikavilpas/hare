import React, { useState, useEffect, useRef } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import {
  useHistory,
  useRouteMatch,
  useParams,
  generatePath,
} from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import * as wordParser from "../../utils/wordParser";

import { getWordDefinitions } from "../../api";
import { bbcode2Text, prettyText } from "../dict/utils";
import { CopyToClipboard } from "react-copy-to-clipboard";

const SearchLink = ({ iconUrl, children, url }) => {
  return (
    <a
      className="external-site"
      rel="noopener noreferrer"
      target="_blank"
      href={url}
    >
      <img src={iconUrl} className="inline icon"></img>
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
          setSearchError("search result did not contain the searched word");
          setSearchResult(null);
        } else {
          setSearchResult(searchResultItem);
          setSearchError(error);

          // parse possible words
          const parseResult = wordParser.parse(searchResultItem.heading);
          const options = [
            ...parseResult.value.kanjiOptions,
            parseResult.value.kana,
          ];
          setWordOptions(options);
          setSelectedWord(options?.[0]);
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

  const headingText = prettyText(searchResult.heading);
  const bodyText = prettyText(searchResult.text);

  return (
    <Container id="export" className="mt-2">
      <h3>辞典内容を共有する</h3>
      <Row id="definition-preview" className="d-flex flex-column h-50">
        <div className="card">
          <div className="card-body" ref={definitionRef}>
            <h3
              className="card-title"
              dangerouslySetInnerHTML={{
                __html: headingText,
              }}
            ></h3>
            <p
              className="card-text"
              dangerouslySetInnerHTML={{
                __html: bodyText,
              }}
            ></p>
          </div>
        </div>
      </Row>
      <Row>
        <CopyToClipboard className="mt-2" text={copiableText} onCopy={() => {}}>
          <Button
            block
            variant="outline-primary"
            onClick={() => {
              const text = definitionRef.current?.innerText
                ?.split("\n")
                .filter((l) => l.length > 0)
                .join("\n");
              setCopiableText(text);
            }}
          >
            TXTをコピー
          </Button>
        </CopyToClipboard>
      </Row>
      {selectedWord && (
        <>
          <hr />
          <Row>
            <h6>外部サイトで「{selectedWord}」を検索 </h6>
            <Form.Control
              as="select"
              custom
              value={selectedWord}
              onChange={(e) => setSelectedWord(e.target.value)}
            >
              {wordOptions.map((w, i) => (
                <option value={w} key={i}>
                  {w}
                </option>
              ))}
            </Form.Control>
            <ul className="external-sites list-unstyled mt-3">
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
            </ul>
          </Row>
        </>
      )}
    </Container>
  );
};

export default ExportView;
