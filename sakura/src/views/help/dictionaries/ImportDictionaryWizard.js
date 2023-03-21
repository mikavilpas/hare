/* eslint-disable import/no-webpack-loader-syntax */

import * as Comlink from "comlink";
import { useRef, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import DictionaryImporterWorker from "worker-loader?inline=no-fallback!../../../utils/yomichan/workers/dictionaryImporter";
import { newDatabaseWorkerInstance } from "../../../utils/yomichan/workers/databaseWorker";
import { readJsonInsideZip, readZip } from "../../../utils/yomichan/zipReader";

const ImportDictionaryWizard = ({ onImportCompleted }) => {
  // upload & validate step
  const [unzippedContents, setUnzippedContents] = useState();
  const [isValidDictionaryFile, setIsValidDictionaryFile] = useState(false);
  const [dictName, setDictName] = useState("");
  const [importError, setImportError] = useState();
  const [alias, setAlias] = useState("");

  // import step
  const [importing, setImporting] = useState(false);
  const [termBanksTotal, setTermBanksTotal] = useState(0);
  const [termBanksProcessed, setTermBanksProcessed] = useState(0);

  const fileChooserRef = useRef();

  const clear = () => {
    // reset any previous state
    setUnzippedContents(null);
    setIsValidDictionaryFile(false);
    setDictName("");
    setImportError(null);
    setAlias("");
    setImporting(false);
    setTermBanksTotal(0);
    setTermBanksProcessed(0);
  };

  return (
    <Card bg="dark" border="light" className="mt-3">
      <Card.Body>
        <Card.Title>Import Dictionary</Card.Title>
        <Card.Text>
          <Form.Group controlId="formFile">
            <Form.Control
              type="file"
              size="sm"
              aria-label="Select yomichan dictionary file"
              ref={fileChooserRef}
              onChange={async (e) => {
                clear();

                // unzip and get file contents
                let data;
                try {
                  console.log("uploading zip into an arrayBuffer");
                  const zipData = await e.target?.files?.[0]?.arrayBuffer();
                  if (!zipData) return;

                  console.log("opening uploaded zip");
                  data = await readZip(zipData);
                  setUnzippedContents(data);
                } catch (e) {
                  setImportError(
                    "Unable to read data from the given file. " + e
                  );
                  return;
                }

                // perform validation
                console.log("starting validation");
                const hasIndex = data.file("index.json") !== null;
                const hasData =
                  data.file("tag_bank_1.json") || data.file("term_bank_1.json");

                let name = await readJsonInsideZip(data, "index.json")
                  .then((json) => json.title)
                  .catch((e) => {
                    setImportError(
                      "Unable to read index.json inside the zip package: " + e
                    );
                  });
                setDictName(name);

                if (!hasIndex) setImportError("Missing index.json");
                if (!hasData) setImportError("Missing data files");
                setIsValidDictionaryFile(hasIndex && hasData && name);
                console.log("validation complete");
              }}
            />
          </Form.Group>

          <div className="mt-2">
            {importError && (
              <Alert variant="danger">Error: {importError}</Alert>
            )}
          </div>

          {isValidDictionaryFile && (
            <>
              <hr />
              <Form.Group as={Row}>
                <Col>
                  <strong>{dictName}</strong>
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="formAlias">
                <Form.Label column>Alias (short name)</Form.Label>
                <Col>
                  <Form.Control
                    type="text"
                    disabled={importing}
                    onChange={(e) => setAlias(e.target.value)}
                    aria-label="Dictionary alias"
                    value={alias}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Col>
                  <Button
                    block
                    aria-label="Import"
                    disabled={importing}
                    onClick={async () => {
                      try {
                        setImporting(true);
                        const db = await newDatabaseWorkerInstance();
                        const existingDictionaries = await db.getDictionaries();

                        // uniqueness validation
                        const aliasNotUnique = existingDictionaries.find(
                          (d) => d.alias === alias
                        );

                        const dictionaryNameNonUnique =
                          existingDictionaries.find((d) => d.name === dictName);
                        if (aliasNotUnique) {
                          const msg = `The alias '${alias}' is already in use by another dictionary.`;
                          setImportError(msg);
                          return;
                        }
                        if (dictionaryNameNonUnique) {
                          const msg = `The dictionary name '${dictName}' has already been imported.`;
                          setImportError(msg);
                          return;
                        }

                        console.log("Starting to add dictionary");
                        const termBanks = unzippedContents.filter(
                          (relativePath) => /term_bank/.test(relativePath)
                        );
                        setTermBanksTotal(termBanks.length);

                        const worker = new DictionaryImporterWorker();
                        const obj = Comlink.wrap(worker);

                        await db.addDictionary(dictName, alias);
                        let readyTermBanks = 0;
                        for (const t of termBanks) {
                          const arraybuf = await t.async("arraybuffer");
                          await obj.importDictionaryAndTerms(
                            dictName,
                            arraybuf
                          );
                          readyTermBanks = readyTermBanks + 1;
                          setTermBanksProcessed(readyTermBanks);
                        }

                        // TODO support tags
                        // TODO support kanji
                        /* const tagBanks = unzippedContents.filter(relativePath => /tag_bank/.test(relativePath)) */
                        onImportCompleted?.();
                        fileChooserRef.current.value = "";
                        clear();
                        console.log("Dictionary added!");
                      } catch (e) {
                        setImportError("Error while importing: " + e);
                      } finally {
                        setImporting(false);
                      }
                    }}
                  >
                    Import
                  </Button>
                </Col>
              </Form.Group>
            </>
          )}

          {importing && (
            <Form.Group>
              <Spinner animation="border" role="status"></Spinner>
              <span className="ml-3">Processing...</span>
            </Form.Group>
          )}

          {importing && (
            <>
              <hr />
              <Form.Group aria-label="Dictionary zip contents">
                Term banks{" "}
                <span className="ml-4 text-muted">
                  {termBanksProcessed} / {termBanksTotal}
                </span>
              </Form.Group>
            </>
          )}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ImportDictionaryWizard;
