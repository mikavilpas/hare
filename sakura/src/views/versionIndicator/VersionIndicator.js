import React, { useState, useEffect } from "react";
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

const VersionIndicator = ({}) => {
  const appName = process.env.REACT_APP_NAME;
  const appVersion = process.env.REACT_APP_VERSION;

  return (
    <aside id="version-indicator">
      {appName} {appVersion}
    </aside>
  );
};

export default VersionIndicator;
