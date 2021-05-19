describe("dictionary view", () => {
  // for now these use the actual api so there is no mocking!

  it("can display a list of dictionaries", () => {
    //
    cy.visit("/");
    cy.contains("広辞苑");
  });

  it("can display search results for a word", () => {
    cy.visit("/");
    cy.get("input[type=search]").type("犬");
    cy.contains("Search").click();

    // can display results
    cy.contains("いぬ【犬・狗】");

    // can display furigana
    cy.get("ruby").should("exist");
  });

  it("stores the current dictionary in the url", () => {
    const assertCanSelect = (dictname) => {
      cy.contains(dictname).should("have.class", "has-search-result").click();
      cy.url().should("contain", `/dict/${encodeURI(dictname)}`);
      cy.contains(dictname).should("have.class", "selected");
    };
    cy.visit("/dict");
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
});
