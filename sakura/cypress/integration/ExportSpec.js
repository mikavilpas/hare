describe("export view", () => {
  it("can display the export view", () => {
    cy.visit("#/export/大辞林/prefix/犬/0", {
      onBeforeLoad(win) {
        cy.spy(win.console, "log").as("consoleLog");
      },
    });

    cy.contains("いぬ【犬・狗】");
    cy.contains("TXTをコピー");

    // can select other options for the target word
    cy.get("select").select("狗");

    // export links must be visible
    cy.contains("Google 画像");
    cy.contains("Google イラスト");
    cy.contains("Jisho sentences");
    cy.contains("Jisho");
    cy.contains("Youglish");
    cy.contains("Audio sentences");
    cy.contains("Yourei sentences");
    cy.contains("Immersion Kit");

    cy.get("@consoleLog").should("be.calledWith", "gtag:", "page_view", {
      page_title: "export",
      page_path: "/大辞林",
    });

    cy.get("#nav-menu").should("be.visible");
  });

  it("exports the correct word", () => {
    cy.visit("#/export/日国/prefix/幸い/0");
    cy.contains("●幸いする");
  });
});
