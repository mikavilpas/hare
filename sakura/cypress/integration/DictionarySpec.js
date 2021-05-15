describe("dictionary view", () => {
  // for now these use the actual api so there is no mocking!

  it("can display a list of dictionaries", () => {
    //
    cy.visit("/");
    cy.contains("広辞苑");
  });

  it("can display search results for a word", () => {
    cy.get("input[type=search]").type("犬");
    cy.contains("Search").click();
  });
});
