import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

function RecursiveLookup({ word, hide }) {
  return (
    <Modal
      show={word?.length}
      onHide={() => hide()}
      dialogClassName="recursive-lookup"
    >
      <Modal.Body>
        <p>you looked up {word}</p>
      </Modal.Body>
    </Modal>
  );
}

export default RecursiveLookup;
