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
