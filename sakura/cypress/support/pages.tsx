export class SettingsPage {
  visit(): void {
    cy.visit("#/settings");
  }

  selectFile(fileName: string): void {
    (
      cy.get(`[aria-label="Select yomichan dictionary file"]`) as any
    ).attachFile(fileName);
  }

  alias(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`[aria-label="Dictionary alias"]`);
  }

  importButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`button[aria-label="Import"]`);
  }

  deleteButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`button[aria-label="Delete dictionary"]`);
  }

  confirmDeleteButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`button[aria-label="Confirm deletion"]`);
  }

  importYomichanDictionary(zipFileName: string) {
    cy.visit("#/settings");

    cy.contains("Import Dictionary");
    this.selectFile(zipFileName);

    // the name of the dict must be shown
    cy.contains("JMdict (English)");
    this.alias().type("jmdict");

    // once the alias has been entered, the import button must be visible
    this.importButton().click();
  }

  ankiConnectUrl(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get("#address");
  }

  ankiConnectDeck(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get("#deck");
  }

  ankiConnectModel(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get("#model");
  }

  ankiConnectFieldMapping(fieldName: string) {
    return cy.get(`[data-field-name="${fieldName}"]`);
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

  resultButton(dictAlias: string) {
    return cy.get("#dictionary-list").contains(dictAlias);
  }

  exportButton() {
    return cy.get(`[aria-label="Export word"]`);
  }
}
