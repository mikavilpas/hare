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
    cy.contains("いぬ【犬】");

    // can display furigana
    cy.get("ruby").should("exist");
  });

  it("stores the current dictionary in the url", () => {
    const assertIsSelected = (dictname) => {
      cy.url().should("contain", `/dict/${encodeURI(dictname)}`);
      cy.contains(dictname).should("have.class", "text-primary");
    };
    cy.visit("/dict");

    // preselects the first dictionary
    assertIsSelected("広辞苑");

    // selecting a new dict must change the url
    cy.contains("大辞林").click();
    assertIsSelected("大辞林");

    cy.contains("大辞泉").click();
    assertIsSelected("大辞泉");

    cy.contains("新辞林").click();
    assertIsSelected("新辞林");

    cy.contains("古語").click();
    assertIsSelected("古語");

    cy.contains("日国").click();
    assertIsSelected("日国");

    cy.contains("学国").click();
    assertIsSelected("学国");

    cy.contains("明鏡").click();
    assertIsSelected("明鏡");

    cy.contains("新明解").click();
    assertIsSelected("新明解");

    cy.contains("漢和").click();
    assertIsSelected("漢和");

    cy.contains("英辞郎").click();
    assertIsSelected("英辞郎");
  });
});
