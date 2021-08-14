describe("grammar view", () => {
  it("can search for grammar points", () => {
    cy.visit("#/grammar", {
      onBeforeLoad(win) {
        cy.spy(win.console, "log").as("consoleLog");
      },
    });

    cy.get("[aria-label=Search]").should("be.focused");
    cy.get("[aria-label=Search]").type("という");

    // a result must now be visible
    cy.contains("ということは");
  });
});
