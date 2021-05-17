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

  it.only("stores the current dictionary in the url", () => {
    cy.visit("/dict");
    // preselects the first dictionary
    cy.url().should("contain", `/dict/${encodeURI("広辞苑")}`);

    // selecting a new dict must change the url
    cy.contains("大辞林").click();
    cy.url().should("contain", `/dict/${encodeURI("大辞林")}`);
  });
});
