import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import Tooltip from "react-bootstrap/Tooltip";
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

const ExistingDictionary = ({
  dictionary,
  onDictionaryDeleted,
  settings,
  updateSettings,
  db,
}) => {
  const [metadata, setMetadata] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    db.getDictionaryMetadata(dictionary.name).then((terms) =>
      setMetadata(terms)
    );
  }, []);

  return (
    <Card
      id={`dictionary-${dictionary.name}`}
      bg="dark"
      border="light"
      className="mt-3"
    >
      <Card.Body>
        <Form.Group as={Row}>
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
        </Form.Group>
        <Row>
          <Col className="d-flex">
            <Form.Label className="flex-grow-1">Terms</Form.Label>
            <span aria-label="term count" className="text-muted">
              {metadata.termCount}
            </span>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <hr />
            <h6>Positioning</h6>
            <p>
              Settings related to where in the dictionary list the yomichan
              dictionary should be shown.
              <br />
              <small className="text-muted">
                The first dictionary is used for recursive searches.
              </small>
            </p>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex">
            <Form.Label className="flex-grow-1">
              Position
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip
                    id="position-explanation"
                    aria-label="position explanation"
                  >
                    Whether this dictionary should appear before or after the
                    online dictionaries in the dictionary list.
                  </Tooltip>
                }
              >
                <i className="ml-2 text-muted bi bi-info-circle"></i>
              </OverlayTrigger>
            </Form.Label>
            <div className="mb-3">
              <Form.Control
                as="select"
                custom
                style={{ width: "130px" }}
                value={settings.positionType}
                onChange={async (e) => {
                  const value = e.target.value;
                  try {
                    await updateSettings({ ...settings, positionType: value });
                  } catch (error) {
                    setError("Could not save settings: " + error);
                  }
                }}
              >
                <option value="before">Before</option>
                <option value="after">After</option>
              </Form.Control>
            </div>
          </Col>
        </Row>
        <Row>
          <Form.Group as={Col} className="d-flex justify-content-between">
            <Form.Label className="flex-grow-1">
              Index
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip
                    id="position-explanation"
                    aria-label="position explanation"
                  >
                    Choose the order your yomichan dictionaries appear in. The
                    dictionaries are ordered from lowest to highest.
                  </Tooltip>
                }
              >
                <i className="ml-2 text-muted bi bi-info-circle"></i>
              </OverlayTrigger>
            </Form.Label>
            <Form.Control
              type="number"
              style={{ width: "130px" }}
              min="0"
              aria-label="dictionary position"
              value={settings.position}
              onChange={async (e) => {
                const value = parseInt(e.target.value);
                try {
                  await updateSettings({ ...settings, position: value });
                } catch (error) {
                  setError("Could not save settings: " + error);
                }
              }}
            />
          </Form.Group>
        </Row>
        {error && (
          <Row>
            <Alert variant="danger">Error: {error}</Alert>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default ExistingDictionary;
