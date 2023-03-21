/// <reference types="cypress" />

import YomichanDatabase from "../../src/utils/yomichan/Types";
import { SettingsPage } from "../support/pages.tsx";
import { AnkiconnectMockApi } from "./AnkiconnectMockApi.tsx";

describe("settings view", () => {
  it("can display the settings view", () => {
    cy.visit("#/settings");

    cy.contains("Reset to host app");
  });
});

describe("importing a yomichan dictionary", () => {
  beforeEach(() => {
    indexedDB.deleteDatabase("hare-yomichan");
  });

  it("can import successfully", () => {
    const page = new SettingsPage();
    page.importYomichanDictionary("jmdict_english_truncated.zip");

    // the import must have completed successfully
    cy.contains("Terms200");
  });

  it("can show errors", () => {
    cy.visit("#/settings");
    // uploading a non-zip must display an error

    const page = new SettingsPage();
    page.selectFile("config.json");
    cy.contains("Error: Unable to read data from the given file");
  });

  it.skip("requires dictionaries to be uniquely named", () => {
    // TODO enable when multiple dictionaries are supported
    cy.visit("#/settings");
    const page = new SettingsPage();
    page.selectFile("jmdict_english_truncated.zip");
    page.alias().type("jmdict");
    page.importButton().click();

    // cannot reupload the same dict with the same alias
    page.selectFile("jmdict_english_truncated.zip");
    page.alias().type("jmdict");
    page.importButton().click();
    cy.contains(
      "Error: The alias 'jmdict' is already in use by another dictionary."
    );

    // cannot reupload the same dict with a different alias
    cy.get(`[aria-label="Dictionary alias"]`).clear().type("jmdict-foo");
    cy.get(`button[aria-label="Import"]`).click();
    cy.contains(
      "Error: The dictionary name 'JMdict (English)' is already in use by another dictionary."
    );
  });

  it("can remove after adding", () => {
    cy.visit("#/settings");
    const page = new SettingsPage();
    page.selectFile("jmdict_english_truncated.zip");
    page.alias().type("jmdict");
    page.importButton().click();

    page.deleteButton().click();
    cy.contains("Confirm deletion");
    page.confirmDeleteButton().click();

    // must have reset to the first state
    cy.contains("Import Dictionary");
  });

  describe.only("ankiconnect settings", () => {
    it("can set the ankiconnect url", () => {
      const ankiconnect = new AnkiconnectMockApi();
      ankiconnect.build();

      cy.visit("#/settings");
      cy.wait("@ankiconnect_is_running");
      cy.wait("@deckNames");
      cy.wait("@modelNames");

      const page = new SettingsPage();

      // the default value must be shown
      page
        .ankiConnectUrl()
        .scrollIntoView()
        .should("contain.value", "http://127.0.0.1:8765");

      page.ankiConnectDeck().select("Default");
      page.ankiConnectModel().select("Japanese 2022 new accent note");
      page.ankiConnectFieldMapping("Expression").select("sentence");
      page.ankiConnectFieldMapping("Reading").select("");
      page
        .ankiConnectFieldMapping("Meaning")
        .select("englishTranslation")
        .then(() => {
          const db = new YomichanDatabase();
          db.getAnkiConnectSettings().then((settings) => {
            expect(settings).to.deep.equal({
              data: {
                address: "http://127.0.0.1:8765",
                selectedDeckName: "Default",
                selectedModelName: "Japanese 2022 new accent note",
                fieldValueMapping: {
                  Expression: "sentence",
                  Reading: "(empty)",
                  Meaning: "englishTranslation",
                },
              },
            });
          });
        });
    });
  });
});
