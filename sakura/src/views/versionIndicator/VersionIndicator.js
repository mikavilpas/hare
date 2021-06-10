import React from "react";

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
