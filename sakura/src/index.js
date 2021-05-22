import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Retrier } from "@jsier/retrier";

function log(msg) {
  console.log(`sakura-customizations: ${msg}`);
}

function prepareHostSite() {
  // the app can only be started after the host app has started. we can't control
  // the timing, but we can retry until that condition is met.
  const retrier = new Retrier({ limit: 10, delay: 1000 });
  return retrier
    .resolve(
      (attempt) =>
        new Promise((resolve, reject) => {
          const runningInProduction =
            window.location.hostname === "sakura-paris.org";
          if (runningInProduction) {
            // if the root element of the host app is present, we need to unload the host app
            const hostAppLoaded = document.getElementById("rr") !== null;
            if (!hostAppLoaded) {
              log("host app is found to be unloaded");
              resolve();
            }

            log("starting host app cleanup");
            Array.from(document.head.children)
              .filter((c) => c.id !== "user-config-css")
              .forEach((c) => c.remove());
            document.body.innerHTML = "";

            log("creating root div");
            const app = document.createElement("div");
            app.id = "sakura-customizations";
            document.body.appendChild(app);
            resolve();
          } else {
            // running in dev
            resolve();
          }
        })
    )
    .catch((error) => {
      alert(
        "sakura-customization. could not load. The host app was not found as having started." +
          error
      );
    });
}

prepareHostSite().then(() => {
  const rootElement = document.getElementById("sakura-customizations");
  log("starting the app");
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    rootElement
  );
});
