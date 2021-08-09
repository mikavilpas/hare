export class SettingsPage {
  visit() {
    cy.visit("#/settings");
  }

  selectFile(fileName) {
    cy.get(`[aria-label="Select yomichan dictionary file"]`).attachFile(
      fileName
    );
  }

  alias() {
    return cy.get(`[aria-label="Dictionary alias"]`);
  }

  importButton() {
    return cy.get(`button[aria-label="Import"]`);
  }

  deleteButton() {
    return cy.get(`button[aria-label="Delete dictionary"]`);
  }

  confirmDeleteButton() {
    return cy.get(`button[aria-label="Confirm deletion"]`);
  }

  importYomichanDictionary(zipFileName) {
    cy.visit("#/settings");

    cy.contains("Import Dictionary");
    this.selectFile(zipFileName);

    // the name of the dict must be shown
    cy.contains("JMdict (English)");
    this.alias().type("jmdict");

    // once the alias has been entered, the import button must be visible
    this.importButton().click();
  }
}

export class DictionaryPage {
  visit() {
    cy.visit("#/");
  }

  searchBox() {
    return cy.get("[aria-label=Search]");
  }

  searchButton() {
    return cy.contains("Search");
  }

  resultButton(dictAlias) {
    return cy.get("#dictionary-list").contains(dictAlias);
  }

  exportButton() {
    return cy.get(`[aria-label="Export word"]`);
  }
}
