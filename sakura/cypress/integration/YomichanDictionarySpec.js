/// <reference types="cypress" />

import { DictionaryPage, SettingsPage } from "../support/pages";

describe("dictionary view with yomichan dictionaries", () => {
  it("displays the search box and a list of dictionaries", () => {
    // set up a yomichan dictionary
    const settingsPage = new SettingsPage();
    settingsPage.visit();
    settingsPage.selectFile("jmdict_english_truncated.zip");
    settingsPage.alias().type("jmdict");
    settingsPage.importButton().click();
    cy.contains("jmdict"); // wait until imported

    // the dictionary must be visible on the dictionary page
    const dictionaryPage = new DictionaryPage();
    dictionaryPage.visit();
    cy.contains("jmdict");

    // can search the dictionary with kanji
    //
    // NOTE: have to search something that's included in the truncated
    // dictionary to get any results.
    dictionaryPage.searchBox().type("彼");
    dictionaryPage.searchButton().click();
    dictionaryPage
      .resultButton("jmdict")
      .should("have.class", "has-search-result")
      .click();
    cy.contains(
      "that (someone or something distant from both speaker and listener, or situation unfamiliar to both speaker and listener)"
    );

    // can search the dictionary with kana
    dictionaryPage.searchBox().clear().type("あの人");
    dictionaryPage.searchButton().click();
    cy.contains("that person");

    // can open the export view
    dictionaryPage.exportButton().click();
  });
});
