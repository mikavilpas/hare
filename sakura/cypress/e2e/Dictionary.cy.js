/// <reference types="cypress" />

import { DictionaryPage, SettingsPage } from "../support/pages";
import { AnkiconnectMockApi } from "./AnkiconnectMockApi.tsx";

describe("dictionary view", () => {
  // for now these use the actual api so there is no mocking!

  // TODO use DictionaryPage to interact with the page

  it("displays the search box and a list of dictionaries", () => {
    //
    cy.visit("#/");

    // the search box has no "clear search" button visible if no text is entered
    cy.get("[aria-label='Clear the search']").should("be.hidden");

    cy.contains("広辞苑");

    // can clear the search input
    cy.get("[aria-label=Search]").should("be.focused");
    cy.get("[aria-label=Search]").type("my query");
    cy.get("[aria-label='Clear the search']").click();
    cy.get("[aria-label=Search]").should("have.value", "");
  });

  it("can display search results for a word", () => {
    cy.visit("#/");
    cy.get("[aria-label=Search]").type("犬");
    cy.contains("Search").click();

    // can display results
    cy.contains("いぬ【犬・狗】");

    // can toggle furigana
    cy.get("ruby rt").should("not.be.visible");
    cy.contains("振").click();
    cy.get("ruby rt").should("be.visible");

    // saves the current search in the url
    cy.url().should("contain", encodeURI("/dict/広辞苑/prefix/犬/0"));

    // displays action buttons
    cy.get(".card-header .definition-toolbar").should("be.visible");

    // has a link to the export page
    cy.get(".card-header .definition-toolbar a")
      .should("have.attr", "href")
      .should("contain", "#/export/広辞苑/prefix/犬/0");

    // indicates the frequency of the word
    cy.contains("5").click();
    // displays an explanation of what the frequency means
    cy.contains("extremely common");

    // can hide the current definition
    cy.contains("いぬ【犬・狗】").click();
    cy.url().should("contain", encodeURI("/dict/広辞苑/prefix/犬/-"));

    // card should be closed and nav controls hidden
    cy.get(".card-header .definition-toolbar").should("not.exist");

    // can do a new search
    cy.contains("いぬ【犬・狗】").click();
    cy.get("button").contains("検索").click();
    // now the word selection list (dropdown) is open.
    // frequencies of the options must be displayed.
    cy.contains("犬 ★★★★★");
    // Select a word to search with.
    cy.get("a").contains("狗").click();
    cy.url().should("contain", encodeURI("/#/dict/広辞苑/prefix/狗/0"));
    cy.get("[aria-label=Search]").should("have.value", "狗");
  });

  it("shows the higher of word/word+suru", () => {
    cy.visit(encodeURI("#/dict/大辞林/prefix/検出/1"));
    // by default, the word+suru is a frequency 3 and the word is 2.
    // But they must both be shown as 3.
    cy.get("[aria-label='frequency ranking']")
      .should("have.length", 2)
      .should("contain", "3");
  });

  it("stores the current dictionary in the url", () => {
    const assertCanSelect = (dictname) => {
      cy.contains(dictname).should("have.class", "has-search-result").click();
      cy.url().should("contain", `/dict/${encodeURI(dictname)}`);
      cy.contains(dictname).should("have.class", "selected");
    };
    cy.visit("#/dict");
    cy.get("[aria-label=Search]").type("犬");
    cy.contains("Search").click();

    // preselects the first dictionary
    assertCanSelect("広辞苑");

    // selecting a new dict must change the url
    assertCanSelect("大辞林");
    assertCanSelect("大辞泉");
    assertCanSelect("新辞林");
    assertCanSelect("古語");
    assertCanSelect("日国");
    assertCanSelect("学国");
    assertCanSelect("明鏡");
    assertCanSelect("新明解");
    assertCanSelect("漢和");
    assertCanSelect("英辞郎");
  });

  it("can preload search results for all dictionaries", () => {
    cy.visit("");
    cy.get("[aria-label=Search]").type("人間");
    cy.contains("Search").click();

    cy.get(".has-search-result").should("exist");
  });

  it("disables dictionaries with no results", () => {
    cy.visit("");
    cy.get("[aria-label=Search]").type("人間関係");
    cy.contains("Search").click();

    cy.contains("古語").should("have.class", "disabled");

    // TODO if the first dict has no results, display the first one with results automatically
  });

  it("can open views from url links", () => {
    // note: go to the last dictionary to make sure the first dictionary is not
    // visible just because it's the default
    cy.visit(encodeURI(`#/dict/英辞郎/prefix/人間関係/0`));
    cy.get("[aria-label=Search]").should("not.be.focused");
    cy.contains("英辞郎").should("have.class", "selected");

    // a definition from that dict should be visible
    cy.contains("interhuman relations");
  });
});

describe("recursive searches", () => {
  it("can open from a link", () => {
    // can open recursive lookup from url
    cy.visit(
      encodeURI("#/dict/広辞苑/prefix/犬/0/recursive/大辞林/prefix/山辺/1")
    );

    // the recursive search should be opened, thus the nav controls should be
    // visible
    cy.get(".modal-content .definition-toolbar").should("be.visible");
  });

  it("can make recursive lookups", () => {
    cy.visit("#/");
    cy.get("[aria-label=Search]").type("犬");
    cy.contains("Search").click();

    // click some word that can be looked up recursively
    cy.get(`[data-word="人"]`).first().should("exist").click();
    cy.get(".modal-content").should("be.visible");
    cy.url().should(
      "contain",
      encodeURI("/dict/広辞苑/prefix/犬/0/recursive/大辞林/prefix/人/0")
    );

    // can close the modal
    cy.get(".modal-backdrop").click({ force: true });
    cy.url().should(
      "match",
      new RegExp(encodeURI("/dict/広辞苑/prefix/犬/0$"))
    );

    // can open recursive lookup from url
    cy.visit(
      encodeURI("#/dict/広辞苑/prefix/犬/0/recursive/大辞林/prefix/山辺/1")
    );
    cy.get(".modal-content").should("be.visible");
    // should contain furigana
    cy.get(".modal-content ruby").should("be.visible");

    cy.get(".modal-content .card-header a")
      .should("have.attr", "href")
      .should("contain", "#/export/大辞林/prefix/山辺/1");

    // can hide the currently opened item
    cy.contains("やまのべ-の-みち【山辺の道】").click();
    cy.url().should(
      "contain",
      encodeURI("#/dict/広辞苑/prefix/犬/0/recursive/大辞林/prefix/山辺/-")
    );

    //
    // can perform a new search from a definition
    cy.contains("やまのべ-の-みち【山辺の道】").click();
    cy.get(".modal-content button").contains("検索").click();
    // now the word selection list (dropdown) is open. Select the word to search with.
    cy.get(".modal-content a").contains("山辺の道").click();
    cy.url().should("contain", encodeURI("/#/dict/広辞苑/prefix/山辺の道/0"));
    cy.get("[aria-label=Search]").should("have.value", "山辺の道");
  });

  it("can show 'no results' when a recursive search provides no results", () => {
    cy.visit("#/dict/広辞苑/prefix/学ぶ/0");

    // click a search word which happens to be included in the definition and
    // which provides no results
    cy.get("span[data-word-reading=まなび]").click();

    cy.contains("No results found for 学ぶ");
    cy.contains("searching in all dictionaries").click();
    cy.get("[aria-label=Search]").should("have.value", "学ぶ");
  });

  it("uses the added yomichan dictionary as the default dict when available", () => {
    // use AnkiConnect mock API to avoid needless connection errors in the cypress test log
    const ankiconnectMockApi = new AnkiconnectMockApi();
    ankiconnectMockApi.build();

    // fallbacking to daijirin is tested in other tests already
    //
    const settings = new SettingsPage();
    settings.visit();
    settings.importYomichanDictionary("jmdict_english_truncated.zip");

    // wait for the dictionary to be imported
    cy.get('[id="dictionary-JMdict (English)"]').should("exist");

    const dict = new DictionaryPage();
    dict.visit();
    dict.searchBox().type("あそこ"); // has to exist in the truncated dict
    dict.searchButton().click();

    // click some word that can be looked up recursively
    cy.get('[data-word="彼"]').first().should("exist").click();

    cy.url().should(
      "contain",
      encodeURI("/#/dict/広辞苑/prefix/あそこ/0/recursive/jmdict/prefix/彼/0")
    );
    cy.contains("over there");

    // must be able to open from a link
    cy.visit(
      encodeURI("/#/dict/広辞苑/prefix/あそこ/0/recursive/jmdict/prefix/あこ/0")
    );
    cy.contains("over there");
  });
});
