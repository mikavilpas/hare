/* eslint-disable import/no-webpack-loader-syntax */

import React, { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { pageView } from "../../telemetry";
import Navbar from "../navbar/Navbar";
import ExistingDictionary from "./dictionaries/ExistingDictionary";
import ImportDictionaryWizard from "./dictionaries/ImportDictionaryWizard";

const resetToHostSite = () => {
  window.__STORE__.dispatch(
    window.__ACTIONS__.updateUserConfig({
      css: "",
      js: "",
    })
  );
};

const Section = ({ children }) => {
  return <div className="mb-4">{children}</div>;
};

const SettingsView = ({
  db,
  yomichanDictsAndSettings,
  refreshYomichanDictsAndSettings,
}) => {
  useEffect(() => {
    pageView("settings");
  }, []);

  return (
    <Container fluid id="settings" className="mt-2">
      <Navbar />
      <Form
        onSubmit={(e) => {
          e.preventDefault(); // don't reload page
        }}
      >
        <h3 className="mb-4">Settings</h3>
        <Section>
          <Row>
            <Col>
              <h4>
                Custom yomichan dictionary{" "}
                <span className="badge badge-secondary">Experimental</span>
              </h4>
            </Col>
          </Row>
          <Row>
            <Col>
              Import a yomichan dictionary{" "}
              <span className="text-muted">(.zip)</span> from your device. It
              will be stored across restarts and will be available for
              searching.
            </Col>
          </Row>
          <Row>
            {yomichanDictsAndSettings?.map((obj, i) => {
              const { dictionary, setting } = obj;
              return (
                <Col xs={12} sm={6}>
                  <ExistingDictionary
                    key={i}
                    db={db}
                    dictionary={dictionary}
                    settings={setting}
                    onDictionaryDeleted={() =>
                      refreshYomichanDictsAndSettings()
                    }
                    updateSettings={(newSettings) => {
                      db.updateDictionarySettings(dictionary.name, newSettings);
                      refreshYomichanDictsAndSettings();
                    }}
                  />
                </Col>
              );
            })}
            {yomichanDictsAndSettings?.length < 2 && (
              <Col xs={12} sm={6}>
                <ImportDictionaryWizard
                  onImportCompleted={() => refreshYomichanDictsAndSettings()}
                />
              </Col>
            )}
          </Row>
        </Section>
        <Section>
          <Row>
            <Col>
              <h4>Reset to host site</h4>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>
                Click this to stop loading the app when the page is reloaded.
              </p>
            </Col>
            <Col className="align-self-baseline">
              <Button variant="danger" onClick={() => resetToHostSite()}>
                Reset to host app
              </Button>
            </Col>
          </Row>
        </Section>
      </Form>
    </Container>
  );
};

export default SettingsView;
