import React, { useState, useEffect, useRef } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Navbar from "../navbar/Navbar";

const resetToHostSite = () => {
  window.__STORE__.dispatch(
    window.__ACTIONS__.updateUserConfig({
      css: "",
      js: "",
    })
  );
};

const SettingsView = ({}) => {
  return (
    <Container fluid id="settings" className="mt-2">
      <Navbar />
      <Form>
        <h3 className="mb-3">Settings</h3>
        <Row>
          <Col>
            <h4>Reset to host site</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>Click this to stop loading the app when the page is reloaded.</p>
          </Col>
          <Col className="align-self-baseline">
            <Button variant="danger" onClick={() => resetToHostSite()}>
              Reset to host app
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default SettingsView;
