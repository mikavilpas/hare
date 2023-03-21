import copy from "copy-to-clipboard";
import { ReactNode, useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

import { useRouteMatch } from "react-router-dom";
import { pageView } from "../../telemetry";
import { addNote } from "../../utils/ankiconnect/ankiconnectApi";
import { frequency } from "../../utils/frequency";
import {
  AudioSentenceSearchResult,
  searchAudioExampleSentencesApi,
  searchSingleDict,
  WordDefinitionResult,
} from "../../utils/search";
import * as wordParser from "../../utils/wordParser";
import YomichanDatabase from "../../utils/yomichan/Types";
import {
  AnkiConnectSettingData,
  AnkiFieldContentType,
  YomichanDictionary,
} from "../../utils/yomichan/YomichanDictionary";
import ExportViewDefinitionTokenProcessor from "../dict/tokenProcessors/exportViewDefinitionTokenProcessor";
import ToPlainTextTokenProcessor from "../dict/tokenProcessors/toPlainTextTokenProcessor";
import { prettyText } from "../dict/utils";
import Navbar from "../navbar/Navbar";
import { DefinitionPreview } from "./DefinitionPreview";
import { ResultItemSection } from "./ResultItemSection";

type ErrorItemProps = { heading: string; error: any };
const ErrorItem = ({ heading, error }: ErrorItemProps) => {
  return (
    <div className="alert alert-danger" role="alert">
      <h4 className="alert-heading">{heading}</h4>
      <p style={{ fontSize: "60%" }}>{error.toString()}</p>
    </div>
  );
};

type CopyButtonProps = {
  getTextToCopy: () => string;
  buttonText: ReactNode;
};
const CopyButton = ({ getTextToCopy, buttonText }: CopyButtonProps) => {
  const [wordWasCopied, setWordWasCopied] = useState(false);

  return (
    <Button
      aria-label="Copy example sentence"
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

type SearchLinkProps = {
  icon: ReactNode;
  children: ReactNode;
  url: string;
};
const SearchLink = ({ icon, children, url }: SearchLinkProps) => {
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

type SearchLinkWithIconProps = {
  iconUrl: string;
  children: ReactNode;
  url: string;
};
const SearchLinkWithIcon = ({
  iconUrl,
  children,
  url,
}: SearchLinkWithIconProps) => {
  const icon = (
    <img
      src={iconUrl}
      style={{ height: "16px", width: "16px" }}
      className="inline icon"
      alt="search"
    ></img>
  );
  return <SearchLink icon={icon} children={children} url={url} />;
};

type SelectSentenceForAnkiCardButtonProps = {
  onSelect: () => void;
  isSelected: boolean;
};
export const SelectSentenceForAnkiCardButton = ({
  onSelect,
  isSelected,
}: SelectSentenceForAnkiCardButtonProps) => {
  return (
    <Button
      variant={isSelected ? "info" : "outline-dark"}
      size="sm"
      onClick={() => {
        onSelect();
      }}
      aria-label="copy sentence"
    >
      <span>
        <i className="bi bi-bookmark"></i>
      </span>
    </Button>
  );
};

type CopyQuoteButtonProps = { text: string; selectedWord?: string };
export const CopyQuoteButton = ({
  text,
  selectedWord,
}: CopyQuoteButtonProps) => {
  const [wordWasCopied, setWordWasCopied] = useState(false);

  const copiableText = text
    ?.replace("―", selectedWord || "")
    .replace("━", selectedWord || "");

  return (
    <Button
      variant={wordWasCopied ? "outline-success" : "outline-dark"}
      size="sm"
      onClick={() => {
        copy(copiableText);
        setWordWasCopied(true);
      }}
    >
      {wordWasCopied ? (
        <span>
          <i className="bi bi-check"></i>
        </span>
      ) : (
        <span>
          <i className="bi bi-box-arrow-right"></i>
        </span>
      )}
    </Button>
  );
};

type ExportViewProps = {
  dicts: unknown[];
  db: YomichanDatabase;
  yomichanDicts: YomichanDictionary[];
  ankiConnectSettings: AnkiConnectSettingData;
};
const ExportView = ({
  dicts,
  db,
  yomichanDicts,
  ankiConnectSettings,
}: ExportViewProps) => {
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<WordDefinitionResult>();
  const [searchError, setSearchError] = useState<string>();
  const [definitionNode, setDefinitionNode] = useState<HTMLElement>();
  const [audioSentences, setAudioSentences] = useState<
    AudioSentenceSearchResult[]
  >([]);
  const [audioSentencesLoading, setAudioSentencesLoading] = useState(false);

  const match = useRouteMatch<{
    dictname: string;
    search: string;
    openeditem: string;
  }>();
  const dict = match.params.dictname;
  const search = match.params.search;
  const openeditem = match.params.openeditem;

  // the alternative spellings of the word
  const [wordOptions, setWordOptions] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<string>();

  const [selectedAnkiJapSentence, setSelectedAnkiJapSentence] =
    useState<string>();
  const [selectedAnkiEngSentence, setSelectedAnkiEngSentence] =
    useState<string>();
  const [selectedAnkiAudioSentenceUrl, setSelectedAnkiAudioSentenceUrl] =
    useState<string>();
  const [ankiCardCreationError, setAnkiCardCreationError] =
    useState<ReactNode>();

  useEffect(() => {
    pageView("export", `/${dict}`);
  }, [dict]);

  useEffect(() => {
    if (!dict || !search || !openeditem) {
      setSearchResult(undefined);
      setSearchError(
        "Internal error - invalid search parameters. Please go back and try again."
      );
      return;
    }

    setLoading(true);

    // OPTIMIZE: no need to wait for every result here - could show results once
    // the single result for this dict is present. Not an issue usually due to
    // api caching and yomichan being fast though.

    // OPTIMIZE: if yomichan dicts are available, could still display something
    // even if the network goes down
    searchSingleDict(search, dict, db, yomichanDicts)
      .then(async (searchResult) => {
        const index = parseInt(openeditem);
        const searchResultItem = searchResult?.result?.words?.[index];

        if (!searchResultItem) {
          setSearchError("the search result did not contain the searched word");
          setSearchResult(undefined);
        } else {
          setSearchError(undefined);
          setSearchResult(searchResultItem);

          // parse possible words
          try {
            const toPlainText = new ToPlainTextTokenProcessor();
            const heading = toPlainText.convertInputText(
              searchResultItem.heading
            );
            const parseResult = wordParser.parse(heading);
            const options = [
              ...parseResult.value.kanjiOptions,
              parseResult.value.kana,
              heading,
            ];

            options.sort(
              (a, b) =>
                (frequency(b)?.rating || 0) - (frequency(a)?.rating || 0)
            );
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

    setAudioSentencesLoading(true);
    searchAudioExampleSentencesApi(search)
      .then((searchResultsArray) => {
        setAudioSentences(searchResultsArray);
      })
      .finally(() => setAudioSentencesLoading(false));

    setSelectedAnkiJapSentence(undefined);
    setSelectedAnkiEngSentence(undefined);
    setSelectedAnkiAudioSentenceUrl(undefined);
    setAnkiCardCreationError(undefined);
  }, [match.params, dicts, db, openeditem]);

  if (loading || !dicts?.length || !search) {
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  } else if (searchError) {
    return <Alert variant="danger">Error: {searchError}</Alert>;
  }

  if (!searchResult || !selectedWord) {
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
          <DefinitionPreview
            headingHtml={headingHtml}
            bodyHtml={bodyHtml}
            setDefinitionNode={setDefinitionNode}
            selectedWord={selectedWord}
            selectedAnkiJapSentence={selectedAnkiJapSentence}
            setSelectedAnkiJapSentence={setSelectedAnkiJapSentence}
          />
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
          <hr />
          <Row className="mt-2">
            <Col>
              <div className="mt-1">例文</div>
            </Col>
          </Row>
          {audioSentencesLoading ? (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          ) : null}
          {audioSentences?.length > 0 ? (
            <Row className="mt-2">
              <Col>
                <table id="example-sentences" className="w-100">
                  <tbody>
                    {audioSentences.map((sentenceRecord) => (
                      <tr
                        className="result-item d-flex flex-column flex-md-row"
                        key={sentenceRecord.audio_jap}
                      >
                        <td className="d-flex col flex-row justify-content-between">
                          <ResultItemSection
                            sentence={sentenceRecord.jap}
                            setSelectedAnkiSentence={setSelectedAnkiJapSentence}
                            selectedAnkiSentence={selectedAnkiJapSentence}
                          />
                        </td>

                        <td className="d-flex col flex-row justify-content-between">
                          {sentenceRecord.eng ? (
                            <ResultItemSection
                              sentence={sentenceRecord.eng}
                              setSelectedAnkiSentence={
                                setSelectedAnkiEngSentence
                              }
                              selectedAnkiSentence={selectedAnkiEngSentence}
                            />
                          ) : null}
                        </td>

                        <td
                          aria-label="actions"
                          className="d-flex col flex-row justify-content-end align-items-center flex-shrink-0 min-width-0 flex-grow-0"
                        >
                          <span
                            aria-label="download audio"
                            style={{ width: "27px" }}
                          >
                            <a
                              href={sentenceRecord.audio_jap}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <i className="bi bi-play"></i>
                            </a>
                          </span>
                          <SelectSentenceForAnkiCardButton
                            onSelect={() =>
                              setSelectedAnkiAudioSentenceUrl(
                                sentenceRecord.audio_jap
                              )
                            }
                            isSelected={
                              sentenceRecord.audio_jap ===
                              selectedAnkiAudioSentenceUrl
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Col>
            </Row>
          ) : null}
          <Row className="mt-2">
            <Col>
              <CopyButton
                buttonText="TXTをコピー"
                getTextToCopy={() => {
                  const text = definitionNode?.innerText
                    ?.split("\n")
                    .filter((l) => l.length > 0)
                    .join("\n");
                  return text || "";
                }}
              />
            </Col>
            <Col>
              <CopyButton
                buttonText="Copy word"
                getTextToCopy={() => selectedWord || ""}
              />
            </Col>
            <Col>
              <Button
                disabled={!selectedAnkiJapSentence}
                block
                className="mt-2"
                variant="outline-primary"
                onClick={async () => {
                  try {
                    const baseUrl = ankiConnectSettings.address;

                    let audioFields: string[] = [];
                    const options: any = {
                      deckName: ankiConnectSettings.selectedDeckName,
                      modelName: ankiConnectSettings.selectedModelName,
                      fields: Object.fromEntries(
                        Object.entries(
                          ankiConnectSettings.fieldValueMapping
                        ).map(([key, value]) => {
                          let fieldContent = "";
                          const newValue = value as AnkiFieldContentType;
                          switch (newValue) {
                            case "audio": {
                              // will be added as a downloadable audio file instead
                              audioFields.push(key);
                              break;
                            }
                            case "sentence": {
                              const copiableText = selectedAnkiJapSentence
                                ?.replace("―", selectedWord || "")
                                ?.replace("━", selectedWord || "");

                              fieldContent =
                                copiableText || selectedAnkiJapSentence || "";
                              break;
                            }
                            case "definition": {
                              fieldContent = headingHtml + "\n" + bodyHtml;
                              break;
                            }
                            case "englishTranslation": {
                              fieldContent = selectedAnkiEngSentence || "";
                              break;
                            }
                            case "word": {
                              fieldContent = selectedWord;
                              break;
                            }
                            case "(empty)": {
                              fieldContent = "";
                              break;
                            }
                            default: {
                              // make sure that all cases are handled or it's a compile error
                              newValue satisfies never;
                            }
                          }

                          return [key, fieldContent];
                        })
                      ),
                    };

                    if (selectedAnkiAudioSentenceUrl) {
                      // get the last "." separated part of the url
                      // which should be the file extension
                      const extension =
                        selectedAnkiAudioSentenceUrl.split(".").slice(-1)[0] ||
                        "mp3";
                      options.audio = {
                        url: selectedAnkiAudioSentenceUrl,
                        filename: `hare_${selectedWord}_${new Date().toISOString()}.${extension}`,
                        fields: audioFields,
                      };
                    }

                    const response = await addNote(baseUrl, options);
                    if (response.error) {
                      setAnkiCardCreationError(
                        <ErrorItem
                          heading="Error creating anki card"
                          error={response.error}
                        />
                      );
                    }
                  } catch (e: any) {
                    setAnkiCardCreationError(
                      <ErrorItem heading="Error creating anki card" error={e} />
                    );
                  }
                }}
              >
                Create anki card
                <span className="ml-2">
                  <i className="bi bi-bookmark"></i>
                </span>
              </Button>
            </Col>
          </Row>
          <Row>
            <Col className="mt-3">{ankiCardCreationError}</Col>
          </Row>
          <hr />
          <Row>
            <Col>
              <ul className="external-sites list-unstyled mt-2">
                <li>
                  <SearchLinkWithIcon
                    iconUrl={"/dict/icons/google.png"}
                    url={`https://www.google.co.jp/search?tbm=isch&q=${selectedWord}`}
                  >
                    Google 画像
                  </SearchLinkWithIcon>
                </li>
                <li>
                  <SearchLinkWithIcon
                    iconUrl={"/dict/icons/google.png"}
                    url={`https://www.google.co.jp/search?tbm=isch&q=${selectedWord} イラスト`}
                  >
                    Google イラスト
                  </SearchLinkWithIcon>
                </li>
                <li>
                  <SearchLinkWithIcon
                    iconUrl={"/dict/icons/jisho.png"}
                    url={`https://jisho.org/search/${selectedWord}`}
                  >
                    Jisho
                  </SearchLinkWithIcon>
                </li>
                <li>
                  <SearchLinkWithIcon
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
                    iconUrl={"/dict/icons/jisho.png"}
                    url={`https://jisho.org/search/${selectedWord}%20%23sentences`}
                  >
                    Jisho sentences
                  </SearchLinkWithIcon>
                </li>
                <li>
                  <SearchLinkWithIcon
                    iconUrl={"https://sentencesearch.neocities.org/favicon.png"}
                    url={`https://sentencesearch.neocities.org/#${selectedWord}`}
                  >
                    Audio sentences
                  </SearchLinkWithIcon>
                </li>
                <li>
                  <SearchLinkWithIcon
                    iconUrl={"https://massif.la/static/favicon_256.png"}
                    url={`https://massif.la/ja/search?q=${selectedWord}`}
                  >
                    Massif
                  </SearchLinkWithIcon>
                </li>
                <li>
                  <SearchLink
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
