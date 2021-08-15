/// <reference types="cypress" />

import YomichanDatabase from "../../src/utils/yomichan/yomichanDatabase";
import { DictionaryPage, SettingsPage } from "../support/pages";

describe("dictionary view with yomichan dictionaries", () => {
  beforeEach(() => {
    indexedDB.deleteDatabase("hare-yomichan");
  });

  // NOTE: in some tests we set up the yomi dictionaries by hand since it's not
  // easy to maintain multiple real zip files for the tests

  it("displays the search box and a list of dictionaries", () => {
    addDict("jmdict_english_truncated.zip", "jmdict");

    // the dictionary must be visible on the dictionary page
    const dictionaryPage = new DictionaryPage();

    // can search the dictionary with kanji
    //
    // NOTE: have to search something that's included in the truncated
    // dictionary to get any results.
    cy.visit("/#/dict/jmdict/prefix/彼/0");
    cy.contains("jmdict");

    dictionaryPage
      .resultButton("jmdict")
      .should("have.class", "has-search-result");
    cy.contains(
      "that (someone or something distant from both speaker and listener, or situation unfamiliar to both speaker and listener)"
    );

    // can open the export view
    dictionaryPage.exportButton().click();
  });

  it("displays no results for recursive search", () => {
    addDict("jmdict_english_truncated.zip", "jmdict");

    cy.visit("#/dict/広辞苑/prefix/学ぶ/0/recursive/jmdict/prefix/学ぶ/0");
    cy.contains("No results found for 学ぶ.");
  });

  it("when there are multiple yomi dicts, can export from the correct dict", () => {
    // there was a bug where only the first yomi dict was exportable
    //
    const db = new YomichanDatabase();

    const prepare = async () => {
      await db.addDictionary("firstDict", "first");
      await db.addTerms("firstDict", [
        ["人", "ひと", "n", "", 615, ["first translation"], 1549400, "P news"],
      ]);

      await db.addDictionary("secondDict", "second");
      await db.addTerms("secondDict", [
        ["人", "ひと", "n", "", 615, ["second translation"], 1549400, "P news"],
      ]);
    };

    cy.wrap(prepare()).then(() => {
      cy.visit("#/settings");

      // sanity check: dictionaries must be added correctly (otherwise the
      // test is broken)
      cy.contains("firstDict");
      cy.contains("secondDict");

      cy.visit("#/export/second/prefix/人/0");

      // the page must contain the correct definition contents
      cy.contains("second translation");
    });
  });

  it("can order yomi dicts relative to the API dicts", () => {
    const db = new YomichanDatabase();

    const prepare = async () => {
      await db.addDictionary("firstDict", "first");
    };

    cy.wrap(prepare()).then(() => {
      cy.visit("#/settings");

      cy.get("#dictionary-firstDict select")
        .select("after")
        .then(() => {
          cy.get("#dictionary-firstDict [aria-label='dictionary position']")
            .type("1")
            .then(() => {
              cy.wrap(db.getDictionariesAndSettings()).then((response) => {
                const f = response.find(
                  (ds) => ds.dictionary.name === "firstDict"
                );
                expect(f.setting).to.eql({
                  dictionaryName: "firstDict",
                  positionType: "after",
                  position: 1,
                });
              });
            });
        });
    });
  });
});

export function addDict(dictName, alias) {
  // set up a yomichan dictionary
  const settingsPage = new SettingsPage();
  settingsPage.visit();
  settingsPage.selectFile(dictName);
  settingsPage.alias().type(alias);
  settingsPage.importButton().click();

  // wait until imported
  cy.contains(alias);
}
