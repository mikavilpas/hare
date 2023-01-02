/* eslint-disable jest/valid-expect, no-undef, jest/valid-expect-in-promise */

import { newDatabase } from "../testUtilsForBrowser";
import YomichanDatabase, {
  YomichanDatabaseVersion,
  YomichanTerm,
} from "./yomichanDatabase";

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
      cy.wrap(db.terms.toArray()).then((actual) => {
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

      cy.wrap<Promise<YomichanTerm[]>, YomichanTerm[]>(
        db.searchPrefix("立")
      ).should((actual: YomichanTerm[]) => {
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
      db
        .addDictionary("testDict", "alias")
        .then(() => db.addTerms("testDict", terms))
    ).then(async () => {
      expect(await db.dictionaries.toArray()).to.eql([
        { name: "testDict", alias: "alias" },
      ]);

      expect(await db.dictionarySettings.toArray()).to.eql([
        {
          dictionaryName: "testDict",
          positionType: "before",
          position: 0,
        },
      ]);
    });
  });

  it("can get a dictionary and its settings", () => {
    const db = newDatabase();
    const prepare = async () => {
      await db.dictionaries.add({ name: "testDict", alias: "tdict" });
      await db.dictionarySettings.add({
        dictionaryName: "testDict",
        positionType: "before",
        position: 0,
      });

      return db.getDictionariesAndSettings();
    };

    cy.wrap(prepare()).then((ds) => {
      expect(ds).eql([
        {
          dictionary: {
            name: "testDict",
            alias: "tdict",
          },
          setting: {
            dictionaryName: "testDict",
            positionType: "before",
            position: 0,
          },
        },
      ]);
    });
  });

  it("can update a dictionary's settings", () => {
    const db = newDatabase();
    cy.wrap(
      db.addDictionary("testDict", "alias").then(() =>
        db.updateDictionarySettings("testDict", {
          positionType: "after",
          position: 1,
        })
      )
    ).then(async () => {
      expect(await db.dictionarySettings.toArray()).to.eql([
        {
          dictionaryName: "testDict",
          positionType: "after",
          position: 1,
        },
      ]);
    });
  });
});

describe("deleting a dictionary", () => {
  it("can delete", () => {
    const db = newDatabase();

    const prepare = async () => {
      await db
        .addDictionary("dictionaryName", "alias", 0, "after")
        .then(() =>
          db.addTerms("dictionaryName", [
            ["藍", "あい", "n", "", 615, ["indigo (dye)"], 1549400, "P news"],
          ])
        );
    };

    cy.wrap(prepare()).then(async () => {
      await db.deleteDictionary("dictionaryName");
      expect(await db.dictionaries.toArray()).to.eql([]);
      expect(await db.terms.toArray()).to.eql([]);
      expect(await db.dictionarySettings.toArray()).to.eql([]);
    });
  });
});

describe("migrations", () => {
  it("migrates versions 1->newest", () => {
    indexedDB.deleteDatabase("hare-yomichan");

    const prepare = async () => {
      // add v1 data
      const db = new YomichanDatabase(YomichanDatabaseVersion.version01);
      db.open();
      await db.dictionaries.add({
        name: "name",
        alias: "alias",
      });
    };

    cy.wrap(prepare()).then(async () => {
      // opening version02 must trigger a migration that adds an entry to
      // dictionarySettings
      const db = new YomichanDatabase(YomichanDatabaseVersion.version02);
      expect(await db.dictionarySettings.toArray()).to.eql([
        {
          dictionaryName: "name",
          positionType: "start",
          position: 0,
        },
      ]);
    });
  });
});
