describe("settings view", () => {
  it("can display the settings view", () => {
    cy.visit("#/settings");
    cy.contains("Reset to host app");
  });
});
