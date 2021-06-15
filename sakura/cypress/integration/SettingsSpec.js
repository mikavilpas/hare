describe("settings view", () => {
  it("can display the settings view", () => {
    cy.visit("#/settings", {
      onBeforeLoad(win) {
        cy.spy(win.console, "log").as("consoleLog");
      },
    });

    cy.contains("Reset to host app");

    // TODO this is kinda silly but couldn't get cypress stubs to work
    cy.get("@consoleLog").should("be.calledWith", "gtag:", "page_view", {
      page_title: "settings",
      page_path: undefined,
    });
  });
});
