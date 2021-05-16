describe("dictionary view", () => {
  // for now these use the actual api so there is no mocking!

  it("can display a list of dictionaries", () => {
    //
    cy.visit("/");
    cy.contains("広辞苑");
  });

  it.only("can display search results for a word", () => {
    // use mocked results because the real api is unreliable sometimes, making
    // development slow
    cy.intercept("/dict?api=1", { fixture: "dicts.json" });
    cy.intercept("/dict?api=1&dict=&q=%E7%8A%AC&type=0", {
      fixture: "definitions/inu.json",
    });

    cy.visit("/");
    cy.get("input[type=search]").type("犬");
    cy.contains("Search").click();
  });
});
