/* eslint-disable jest/valid-expect, no-undef, jest/valid-expect-in-promise */

import * as persistentStore from "./persistentStore";

describe("storing a dict zip file", () => {
  it("can store and retrieve", () => {
    const file = "jmdict_english.zip";
    cy.fixture(file).then((base64) => {
      const blob = Cypress.Blob.base64StringToBlob(base64, "application/zip");

      cy.wrap(persistentStore.initialize()).then((data) => {
        expect(data).to.have.property("supported", true);
        expect(data).to.have.property("percentageUsed");
        expect(data).to.have.property("remaining");
        expect(data).to.have.property("quota");
      });

      cy.wrap(persistentStore.store(file, blob)).then(() => {
        cy.wrap(persistentStore.get(file)).then((storedData) => {
          expect(storedData.type).to.eql("application/zip");
          expect(storedData.size).to.be.greaterThan(600_000);

          cy.wrap(persistentStore.getKeys()).then((keys) => {
            expect(keys).to.include(file);
          });

          cy.wrap(persistentStore.remove(file)).then(() => {
            cy.wrap(persistentStore.getKeys()).should((keys) => {
              expect(keys).to.eql([]);
            });
          });
        });
      });
    });
  });
});
