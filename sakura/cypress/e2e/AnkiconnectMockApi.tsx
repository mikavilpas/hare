export class AnkiconnectMockApi {
  build(): void {
    cy.intercept("GET", "http://127.0.0.1:8765/", {
      body: "Ankiconnect is running.",
    }).as("ankiconnect_is_running");

    cy.intercept("POST", "http://127.0.0.1:8765/", (request) => {
      if (request.body.version !== 6) {
        throw new Error(`Unsupported version ${request.body.version}`);
      }

      switch (request.body.action) {
        case "deckNames":
          request.alias = "deckNames";
          request.reply({
            body: {
              result: ["Default"],
              error: null,
            },
          });
          break;
        case "modelNames":
          request.alias = "modelNames";
          request.reply({
            result: ["Japanese 2022 new accent note"],
            error: null,
          });
          break;
        case "modelFieldNames":
          request.alias = "modelFieldNames";
          request.reply({
            result: ["Expression", "Reading", "Meaning"],
            error: null,
          });
          break;
        default:
          throw new Error(`Unsupported action ${request.body.action}`);
      }
    });
  }
}
