/// <reference types="cypress" />

import { SettingsPage } from "../support/pages";

describe("settings view", () => {
  it("can display the settings view", () => {
    cy.visit("#/settings", {
      onBeforeLoad(win) {
        cy.spy(win.console, "log").as("consoleLog");
      },
    });

    cy.contains("Reset to host app");

    // TODO this is kinda silly but couldn't get cypress stubs to work
    cy.get("@consoleLog").should("be.calledWith", "gtag:", "page_view", {
      page_title: "settings",
      page_path: undefined,
    });
  });
});

describe("importing a yomichan dictionary", () => {
  beforeEach(() => {
    indexedDB.deleteDatabase("hare-yomichan");
  });

  it("can import successfully", () => {
    cy.visit("#/settings");

    cy.contains("Import Dictionary");
    const page = new SettingsPage();
    page.selectFile("jmdict_english_truncated.zip");

    // the name of the dict must be shown
    cy.contains("JMdict (English)");
    page.alias().type("jmdict");

    // once the alias has been entered, the import button must be visible
    page.importButton().click();

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
});
