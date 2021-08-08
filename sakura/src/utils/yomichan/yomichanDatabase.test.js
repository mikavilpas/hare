/* eslint-disable jest/valid-expect, no-undef, jest/valid-expect-in-promise */

import IDBKeyRange from "fake-indexeddb/lib/FDBKeyRange";
import YomichanDatabase from "./yomichanDatabase";

function newDatabase() {
  const FDBFactory = require("fake-indexeddb/lib/FDBFactory");

  // Whenever you want a fresh indexedDB
  const indexedDB = new FDBFactory();
  const db = new YomichanDatabase({ indexedDB, IDBKeyRange });
  return db;
}

describe("yomichan database", () => {
  it("can add terms", () => {
    const terms = [
      [
        "嵐",
        "あらし",
        "n",
        "",
        712,
        ["storm", "tempest"],
        1549340,
        "P ichi news",
      ],
      ["藍", "あい", "n", "", 615, ["indigo (dye)"], 1549400, "P news"],
      ["藍", "あい", "n", "", 614, ["indigo (colour)"], 1549400, "P news"],
    ];

    const db = newDatabase();
    cy.wrap(db.addTerms("fakedict", terms)).then(() => {
      //
      cy.wrap(db.db.terms.toArray()).then((actual) => {
        expect(actual).to.eql([
          {
            dictionaryName: "fakedict",
            expression: "嵐",
            reading: "あらし",
            tags: "n",
            rules: "",
            popularity: 712,
            definitions: ["storm", "tempest"],
            id: 1,
          },
          {
            dictionaryName: "fakedict",
            expression: "藍",
            reading: "あい",
            tags: "n",
            rules: "",
            popularity: 615,
            definitions: ["indigo (dye)"],
            id: 2,
          },
          {
            dictionaryName: "fakedict",
            expression: "藍",
            reading: "あい",
            tags: "n",
            rules: "",
            popularity: 614,
            definitions: ["indigo (colour)"],
            id: 3,
          },
        ]);
      });
    });
  });

  it("can search terms by prefix", () => {
    const terms = [
      [
        "立ち",
        "たち",
        "n",
        "",
        614,
        ["passage of time", "lapse"],
        1551240,
        "P news",
      ],
      [
        "立ち会う",
        "たちあう",
        "v5u vi",
        "v5",
        103,
        ["to be present", "to be witness to"],
        1551270,
        "news",
      ],
      [
        "立ち回り先",
        "たちまわりさき",
        "n",
        "",
        4,
        ["whereabouts", "present location"],
        1551280,
        "",
      ],
      [
        "立回り先",
        "たちまわりさき",
        "n",
        "",
        4,
        ["whereabouts", "present location"],
        1551280,
        "",
      ],
      [
        "立ち回る",
        "たちまわる",
        "v5r vi",
        "v5",
        9,
        ["to walk about", "to walk around"],
        1551290,
        "",
      ],
      ["立回る", "たちまわる", "v5r vi", "v5", 7, ["to turn up"], 1551290, ""],
      [
        "立回る",
        "たちまわる",
        "v5r vi",
        "v5",
        6,
        ["to brawl (in a play, etc.)"],
        1551290,
        "",
      ],
      [
        "立ち寄る",
        "たちよる",
        "v5r vi",
        "v5",
        711,
        ["to stop by", "to drop in for a short visit"],
        1551300,
        "P ichi news",
      ],
    ];

    const db = newDatabase();
    cy.wrap(db.addTerms("fakedict", terms)).then(() => {
      // returns all terms that match the kanji

      cy.wrap(db.searchPrefix("立")).then((actual) => {
        expect(actual.map((a) => a.expression)).to.eql([
          "立ち",
          "立ち会う",
          "立ち回り先",
          "立ち回る",
          "立ち寄る",
          "立回り先",
          "立回る",
          "立回る",
        ]);
      });
    });
  });
});

describe("adding a dictionary", () => {
  it("can add a dictionary", () => {
    const terms = [
      ["藍", "あい", "n", "", 615, ["indigo (dye)"], 1549400, "P news"],
      ["藍", "あい", "n", "", 614, ["indigo (colour)"], 1549400, "P news"],
    ];
    const db = newDatabase();

    cy.wrap(
      db.addDictionary("dictionaryName", "alias", (dict) => {
        db.addTerms(dict.name, terms);
      })
    ).then(() => {
      cy.wrap(db.db.dictionaries.toArray()).then((actual) => {
        expect(actual).to.eql([
          {
            name: "dictionaryName",
            alias: "alias",
          },
        ]);
      });
    });
  });
});

describe("deleting a dictionary", () => {
  it("can delete", () => {
    const terms = [
      ["藍", "あい", "n", "", 615, ["indigo (dye)"], 1549400, "P news"],
    ];
    const db = newDatabase();

    cy.wrap(
      db.addDictionary("dictionaryName", "alias", (dict) => {
        db.addTerms(dict.name, terms);
      })
    )
      .then(() => {
        cy.wrap(db.deleteDictionary("dictionaryName"));
      })
      .then(() => {
        cy.wrap(db.db.dictionaries.toArray()).then((actual) => {
          expect(actual).to.eql([]);
        });
      })
      .then(() => {
        cy.wrap(db.db.terms.toArray()).then((actual) => {
          expect(actual).to.eql([]);
        });
      });
  });
});
