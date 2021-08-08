/* eslint-disable jest/valid-expect, no-undef, jest/valid-expect-in-promise */

import * as zipReader from "./zipReader";

describe("reading a zip", () => {
  it("can extract data from a zip file", () => {
    cy.fixture("jmdict_english.zip").then((base64) => {
      const blob = Cypress.Blob.base64StringToBlob(base64, "application/zip");

      cy.wrap(zipReader.readZip(blob)).then((zip) => {
        expect(zip?.files).to.have.property("index.json");
      });
    });
  });
});
