/// <reference types="cypress" />

import { newDatabase } from "../../src/utils/testUtilsForBrowser";

describe("export view", () => {
  beforeEach(() => {
    mockAudioSentences();
  });

  it("can display the export view", () => {
    cy.visit("#/export/大辞林/prefix/犬/0");

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
    cy.contains("Massif");
    cy.contains("Immersion Kit");
    cy.get("[aria-label='Copy example sentence']").should("be.visible");

    cy.get("#nav-menu").should("be.visible");
  });

  it("exports the correct word", () => {
    cy.visit("#/export/日国/prefix/幸い/0");
    cy.contains("●幸いする");
  });

  it("can copy example sentences", () => {
    // copying single sentences
    cy.visit("/#/export/広辞苑/prefix/白/17");
    cy.get(".quote").should("have.length.above", 0);

    // copying works from a shinmeikai example sentence block
    cy.visit("/#/export/新明解/prefix/金品/0");
    cy.get(".example-sentence-group .quote").should("have.length.above", 0);
  });

  it("can display audio sentences", () => {
    cy.visit("#/export/大辞林/prefix/品物/0");
    cy.wait("@get audio sentences");
    cy.contains("頼んでいた品物が今日届いた。");
    cy.contains("The article which I have ordered arrived today.");
    cy.get(`[aria-label="download audio"]`).should("be.visible");
  });

  describe("anki export", () => {
    beforeEach(async () => {
      // creating the database will also populate it with the default settings
      const db = newDatabase();
      db.saveAnkiConnectSetting("address", "http://localhost:12345");
      db.saveAnkiConnectSetting("selectedDeckName", "myDeck");
      db.saveAnkiConnectSetting("selectedModelName", "myModel");
      db.saveAnkiConnectSetting("fieldValueMapping", {
        Expression: "sentence",
        Meaning: "definition",
        Audio: "audio",
        Focus: "word",
        Meaning2: "englishTranslation",
        Snapshot: "(empty)",
      });
    });

    it("can export dictionary example sentences", () => {
      cy.visit("#/export/大辞林/prefix/品物/0");

      // select an example sentence from the dictionary definition
      cy.contains("高価な―をとりそろえる")
        .children(".quote-actions")
        .find(`[aria-label="copy sentence"]`)
        .click();

      cy.intercept("http://localhost:12345", "POST").as("create jap only");
      cy.contains("button", "Create anki card").click();
      cy.wait("@create jap only").then((interception) => {
        expect(interception.request.body).to.deep.eql({
          action: "addNote",
          version: 6,
          params: {
            note: {
              deckName: "myDeck",
              modelName: "myModel",
              fields: {
                Expression: "高価な品物をとりそろえる",
                Meaning:
                  'しな-もの【品物】\n<div class="meta-information"><mark>しな-もの</mark> [0] 【品物】</div><div class="definition-section level-3">\n              <span class="heading">(1)</span>\n              <div class="content">物品。また，特に商品。しな。<span class="quote border border-dark rounded mr-3">\n              「高価な―をとりそろえる」\n              <span class="quote-actions" data-quote="高価な―をとりそろえる"></span>\n            </span><span class="quote border border-dark rounded mr-3">\n              「店先に―がなくなる」\n              <span class="quote-actions" data-quote="店先に―がなくなる"></span>\n            </span><br /></div>\n            </div><div class="definition-section level-3">\n              <span class="heading">(2)</span>\n              <div class="content">美人。品者。<span class="quote border border-dark rounded mr-3">\n              「都の水でみがき上げ，娘盛りの―が/浄瑠璃・先代萩」\n              <span class="quote-actions" data-quote="都の水でみがき上げ，娘盛りの―が/浄瑠璃・先代萩"></span>\n            </span><br /></div>\n            </div>',
                Audio: "",
                Focus: "品物",
                Meaning2: "",
                Snapshot: "",
              },
              tags: ["hare"],
              options: {
                allowDuplicate: true,
              },
            },
          },
        });
      });

      // next, select an audio sentence
      cy.contains("頼んでいた品物が今日届いた。")
        .parent()
        .find(`[aria-label="copy sentence"]`)
        .click();
      cy.contains("The article which I have ordered arrived today.")
        .parent()
        .find(`[aria-label="copy sentence"]`)
        .click();
      cy.get(`[aria-label="download audio"]`)
        .parent()
        .find(`[aria-label="copy sentence"]`)
        .first()
        .click();

      cy.intercept("http://localhost:12345", "POST").as("create jap,eng,audio");
      cy.contains("button", "Create anki card").click();
      cy.wait("@create jap,eng,audio").then((interception) => {
        const body = interception.request.body;
        expect(body).to.nested.include({
          action: "addNote",
          version: 6,
          "params.note.fields.Expression": "頼んでいた品物が今日届いた。",
          "params.note.fields.Meaning":
            'しな-もの【品物】\n<div class="meta-information"><mark>しな-もの</mark> [0] 【品物】</div><div class="definition-section level-3">\n              <span class="heading">(1)</span>\n              <div class="content">物品。また，特に商品。しな。<span class="quote border border-dark rounded mr-3">\n              「高価な―をとりそろえる」\n              <span class="quote-actions" data-quote="高価な―をとりそろえる"></span>\n            </span><span class="quote border border-dark rounded mr-3">\n              「店先に―がなくなる」\n              <span class="quote-actions" data-quote="店先に―がなくなる"></span>\n            </span><br /></div>\n            </div><div class="definition-section level-3">\n              <span class="heading">(2)</span>\n              <div class="content">美人。品者。<span class="quote border border-dark rounded mr-3">\n              「都の水でみがき上げ，娘盛りの―が/浄瑠璃・先代萩」\n              <span class="quote-actions" data-quote="都の水でみがき上げ，娘盛りの―が/浄瑠璃・先代萩"></span>\n            </span><br /></div>\n            </div>',
          "params.note.fields.Audio": "",
          "params.note.fields.Focus": "品物",
          "params.note.fields.Meaning2":
            "The article which I have ordered arrived today.",
          "params.note.deckName": "myDeck",
          "params.note.modelName": "myModel",
          "params.note.tags[0]": "hare",
          "params.note.options.allowDuplicate": true,
          "params.note.audio[0].url":
            "https://receptomanijalogi.web.app/audio/anki_5k_media/rec1409219283.mp3",
          "params.note.audio[0].fields[0]": "Audio",
        });
      });
    });
  });

  function mockAudioSentences(response) {
    if (!response) {
      response = [
        {
          jap: "頼んでいた品物が今日届いた。",
          source: "anki5k",
          audio_jap:
            "https://receptomanijalogi.web.app/audio/anki_5k_media/rec1409219283.mp3",
          eng: "The article which I have ordered arrived today.",
        },
        {
          jap: "先週送った品物が届いていません。",
          source: "iknow_words",
          audio_jap:
            "https://receptomanijalogi.web.app/audio/assets3.iknow.jp/assets/users/Smart.fm/e57u7iajbs.mp3",
          eng: "The goods we sent last week haven't arrived yet.",
        },
      ];
    }

    cy.intercept(
      {
        hostname:
          "4o6cbb7hwwxbtxiygkdrw3bvr40ikrdl.lambda-url.eu-north-1.on.aws",
      },
      {
        body: [
          {
            jap: "頼んでいた品物が今日届いた。",
            source: "anki5k",
            audio_jap:
              "https://receptomanijalogi.web.app/audio/anki_5k_media/rec1409219283.mp3",
            eng: "The article which I have ordered arrived today.",
          },
          {
            jap: "先週送った品物が届いていません。",
            source: "iknow_words",
            audio_jap:
              "https://receptomanijalogi.web.app/audio/assets3.iknow.jp/assets/users/Smart.fm/e57u7iajbs.mp3",
            eng: "The goods we sent last week haven't arrived yet.",
          },
        ],
      }
    ).as("get audio sentences");
  }
});
