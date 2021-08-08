import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import { newDatabaseWorkerInstance } from "../../../utils/yomichan/workers/databaseWorker";

const DeleteButton = ({ dictionary, setError, onDictionaryDeleted }) => {
  const [deleting, setDeleting] = useState(false);

  const confirmation = (
    <Popover id="delete-confirmation">
      <Popover.Title className="title">Confirm deletion</Popover.Title>
      <Popover.Content className="content">
        <div>
          This will remove the dictionary and all its contents permanently. The
          deletion will take a minute for large dictionaries or low end devices.
        </div>
        <Button
          block
          aria-label="Confirm deletion"
          variant="dark"
          disabled={deleting}
          className="mt-2"
          onClick={() => {
            newDatabaseWorkerInstance()
              .then(async (db) => {
                setDeleting(true);
                try {
                  await db.deleteDictionary(dictionary.name);
                  onDictionaryDeleted();
                } finally {
                  setDeleting(false);
                }
              })
              .catch((e) => {
                setError(e);
              });
          }}
        >
          <div>Yes, delete</div>
          {deleting && (
            <div>
              <Spinner size="sm" animation="border" role="status">
                <span className="sr-only">Deleting...</span>
              </Spinner>
            </div>
          )}
        </Button>
      </Popover.Content>
    </Popover>
  );

  return (
    <OverlayTrigger trigger="click" placement="left" overlay={confirmation}>
      <Button variant="danger" aria-label="Delete dictionary">
        <i className="bi bi-trash"></i>
      </Button>
    </OverlayTrigger>
  );
};

const ExistingDictionary = ({ dictionary, onDictionaryDeleted }) => {
  const [metadata, setMetadata] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    newDatabaseWorkerInstance().then((worker) => {
      worker
        .getDictionaryMetadata(dictionary.name)
        .then((terms) => setMetadata(terms));
    });
  }, []);

  return (
    <Col>
      <Card bg="dark" border="light" className="mt-3">
        <Card.Body>
          <Row>
            <Col>
              <div className="d-flex">
                <Card.Title className="flex-grow-1">
                  {dictionary.alias}
                </Card.Title>
                <div>
                  <DeleteButton
                    dictionary={dictionary}
                    setError={setError}
                    onDictionaryDeleted={onDictionaryDeleted}
                  />
                </div>
              </div>

              <Card.Subtitle className="text-muted mb-2">
                {dictionary.name}
              </Card.Subtitle>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card.Text>
                Terms
                <span className="ml-4 text-muted">{metadata.termCount}</span>
              </Card.Text>
            </Col>
          </Row>
          {error && (
            <Row>
              <Alert variant="danger">Error: {error}</Alert>
            </Row>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ExistingDictionary;
