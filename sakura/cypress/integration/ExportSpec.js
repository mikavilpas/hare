/// <reference types="cypress" />

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
