describe("dictionary view", () => {
  // for now these use the actual api so there is no mocking!

  it("can display a list of dictionaries", () => {
    //
    cy.visit("#/");
    cy.contains("広辞苑");
  });

  it("can display search results for a word", () => {
    cy.visit("#/");
    cy.get("input[type=search]").type("犬");
    cy.contains("Search").click();

    // can display results
    cy.contains("いぬ【犬・狗】");

    // can display furigana
    cy.get("ruby").should("exist");

    // saves the current search in the url
    cy.url().should("contain", encodeURI("/dict/広辞苑/prefix/犬/0"));

    // displays action buttons
    cy.get(".card-header nav").should("be.visible");

    // has a link to the export page
    cy.get(".card-header nav a")
      .should("have.attr", "href")
      .should("contain", "#/export/広辞苑/prefix/犬/0");

    // indicates the frequency of the word
    cy.contains("5");

    // can hide the current definition
    cy.contains("いぬ【犬・狗】").click();
    cy.url().should("contain", encodeURI("/dict/広辞苑/prefix/犬/-"));

    // card should be closed and nav controls hidden
    cy.get(".card-header nav").should("not.exist");
  });

  it("can render complex definitions", () => {
    cy.visit(encodeURI("/dict/大辞林/prefix/雪/0"));
  });

  it("stores the current dictionary in the url", () => {
    const assertCanSelect = (dictname) => {
      cy.contains(dictname).should("have.class", "has-search-result").click();
      cy.url().should("contain", `/dict/${encodeURI(dictname)}`);
      cy.contains(dictname).should("have.class", "selected");
    };
    cy.visit("#/dict");
    cy.get("input[type=search]").type("犬");
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
    cy.get("input[type=search]").type("人間");
    cy.contains("Search").click();

    cy.get(".has-search-result").should("exist");
  });

  it("disables dictionaries with no results", () => {
    cy.visit("");
    cy.get("input[type=search]").type("人間関係");
    cy.contains("Search").click();

    cy.contains("古語").should("have.class", "disabled");

    // TODO if the first dict has no results, display the first one with results automatically
  });

  it("can open views from url links", () => {
    // note: go to the last dictionary to make sure the first dictionary is not
    // visible just because it's the default
    cy.visit(encodeURI(`#/dict/英辞郎/prefix/人間関係/0`));
    cy.contains("英辞郎").should("have.class", "selected");

    // a definition from that dict should be visible
    cy.contains("interhuman relations");

    // can open recursive lookup from url
    cy.visit(
      encodeURI("#/dict/広辞苑/prefix/犬/0/recursive/大辞林/prefix/山辺/1")
    );

    // the recursive search should be opened, thus the nav controls should be
    // visible
    cy.get(".modal-content nav").should("be.visible");
  });

  it("can make recursive lookups", () => {
    cy.visit("#/");
    cy.get("input[type=search]").type("犬");
    cy.contains("Search").click();

    // click some word that can be looked up recursively
    cy.get("[data-word=山辺]").should("exist").click();
    cy.get(".modal-content").should("be.visible");
    cy.url().should(
      "contain",
      encodeURI("/dict/広辞苑/prefix/犬/0/recursive/大辞林/prefix/山辺/0")
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

    cy.get(".modal-content .card-header nav a")
      .should("have.attr", "href")
      .should("contain", "#/export/大辞林/prefix/山辺/1");

    // can hide the currently opened item
    cy.contains("やまのべ-の-みち【山辺の道】").click();
    cy.url().should(
      "contain",
      encodeURI("#/dict/広辞苑/prefix/犬/0/recursive/大辞林/prefix/山辺/-")
    );
  });

  it("can show 'no results' when a recursive search provides no results", () => {
    cy.visit("#/dict/広辞苑/prefix/学ぶ/0");

    // click a search word which happens to be included in the definition and
    // which provides no results
    cy.get("span[data-word-reading=まなび]").click();

    cy.contains("No results found for 学ぶ");
  });
});

// TODO can't render the first definition's last line properly http://localhost:4000/dict/%E5%BA%83%E8%BE%9E%E8%8B%91/prefix/%E7%A7%8B
// TODO no results for recursive search /dict/広辞苑/prefix/犬/recursive/大辞林/prefix/呼ぶ
