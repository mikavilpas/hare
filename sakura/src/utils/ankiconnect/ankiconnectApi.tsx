import axios from "axios";
import { Dictionary } from "lodash";

export type AnkiconnectApiResponse<T> = { result?: T; error?: string };

export type TestConnectionResponse = { apiVersion: string };
export async function testConnection(
  baseUrl: string
): Promise<AnkiconnectApiResponse<TestConnectionResponse>> {
  try {
    const response = await axios.get(baseUrl);
    return { result: { apiVersion: response.data } };
  } catch (e) {
    return {
      error: `Error connecting. Verify ankiconnect is running and has been configured to allow connections from ${window.location.host}.`,
    };
  }
}

// Gets the complete list of deck names for the current user.
//
// Sample request:
//
// {
// "action": "deckNames",
// "version": 6
// }
// Sample result:
//
// {
// "result": ["Default"],
// "error": null
// }
// https://foosoft.net/projects/anki-connect/index.html#deck-actions
export async function getDecks(
  baseUrl: string
): Promise<AnkiconnectApiResponse<string[]>> {
  try {
    const response = await axios.post(baseUrl, {
      action: "deckNames",
      version: 6,
    });
    return { result: response.data.result };
  } catch (e) {
    return {
      error: `Could not get available decks from ankiconnect.`,
    };
  }
}

// Gets the complete list of model names for the current user.
// Sample request:
// {
//     "action": "modelNames",
//     "version": 6
// }
// Sample result:
// {
//     "result": ["Basic", "Basic (and reversed card)"],
//     "error": null
// }
// https://foosoft.net/projects/anki-connect/index.html#model-actions
export async function getModels(
  baseUrl: string
): Promise<AnkiconnectApiResponse<string[]>> {
  try {
    const response = await axios.post(baseUrl, {
      action: "modelNames",
      version: 6,
    });
    return { result: response.data.result };
  } catch (e) {
    return {
      error: `Could not get available models from ankiconnect.`,
    };
  }
}

// Gets the complete list of field names for the provided model name.
//
// Sample request:
//
// {
//     "action": "modelFieldNames",
//     "version": 6,
//     "params": {
//         "modelName": "Basic"
//     }
// }
// Sample result:
//
// {
//     "result": ["Front", "Back"],
//     "error": null
// }
// https://foosoft.net/projects/anki-connect/index.html#model-actions

export async function getModelFieldNames(
  baseUrl: string,
  modelName: string
): Promise<AnkiconnectApiResponse<string[]>> {
  try {
    const response = await axios.post(baseUrl, {
      action: "modelFieldNames",
      version: 6,
      params: { modelName: modelName },
    });
    return { result: response.data.result };
  } catch (e) {
    return {
      error: `Could not get available fields for the selected model from ankiconnect.`,
    };
  }
}

// Note Actions
// addNote
//
// Creates a note using the given deck and model, with the provided field values
// and tags. Returns the identifier of the created note created on success, and
// null on failure.
//
// Anki-Connect can download audio, video, and picture files and embed them in
// newly created notes. The corresponding audio, video, and picture note members
// are optional and can be omitted. If you choose to include any of them, they
// should contain a single object or an array of objects with the mandatory
// filename field and one of data, path or url. Refer to the documentation of
// storeMediaFile for an explanation of these fields. The skipHash field can be
// optionally provided to skip the inclusion of files with an MD5 hash that
// matches the provided value. This is useful for avoiding the saving of error
// pages and stub files. The fields member is a list of fields that should play
// audio or video, or show a picture when the card is displayed in Anki. The
// allowDuplicate member inside options group can be set to true to enable
// adding duplicate cards. Normally duplicate cards can not be added and trigger
// exception.
//
// The duplicateScope member inside options can be used to specify the scope for
// which duplicates are checked. A value of "deck" will only check for
// duplicates in the target deck; any other value will check the entire
// collection.
//
// The duplicateScopeOptions object can be used to specify some additional
// settings:
//
// duplicateScopeOptions.deckName will specify which deck to use for checking
// duplicates in. If undefined or null, the target deck will be used.
//
// duplicateScopeOptions.checkChildren will change whether or not duplicate
// cards are checked in child decks. The default value is false.
//
// duplicateScopeOptions.checkAllModels specifies whether duplicate checks are
// performed across all note types. The default value is false.
//
// Sample request:
// {
//     "action": "addNote",
//     "version": 6,
//     "params": {
//         "note": {
//             "deckName": "Default",
//             "modelName": "Basic",
//             "fields": {
//                 "Front": "front content",
//                 "Back": "back content"
//             },
//             "options": {
//                 "allowDuplicate": false,
//                 "duplicateScope": "deck",
//                 "duplicateScopeOptions": {
//                     "deckName": "Default",
//                     "checkChildren": false,
//                     "checkAllModels": false
//                 }
//             },
//             "tags": [
//                 "yomichan"
//             ],
//             "audio": [{
//                 "url": "https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kanji=猫&kana=ねこ",
//                 "filename": "yomichan_ねこ_猫.mp3",
//                 "skipHash": "7e2c2f954ef6051373ba916f000168dc",
//                 "fields": [
//                     "Front"
//                 ]
//             }],
//             "video": [{
//                 "url": "https://cdn.videvo.net/videvo_files/video/free/2015-06/small_watermarked/Contador_Glam_preview.mp4",
//                 "filename": "countdown.mp4",
//                 "skipHash": "4117e8aab0d37534d9c8eac362388bbe",
//                 "fields": [
//                     "Back"
//                 ]
//             }],
//             "picture": [{
//                 "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/A_black_cat_named_Tilly.jpg/220px-A_black_cat_named_Tilly.jpg",
//                 "filename": "black_cat.jpg",
//                 "skipHash": "8d6e4646dfae812bf39651b59d7429ce",
//                 "fields": [
//                     "Back"
//                 ]
//             }]
//         }
//     }
// }

export interface NoteOptions {
  deckName: string;
  modelName: string;
  fields: Dictionary<string>;
  audio?: AudioOptions;
}
export interface AudioOptions {
  url: string;
  filename: string;
  fields: string[];
}

export async function addNote(
  baseUrl: string,
  noteOptions: NoteOptions
): Promise<AnkiconnectApiResponse<number>> {
  try {
    const payload: any = {
      note: {
        deckName: noteOptions.deckName,
        modelName: noteOptions.modelName,
        fields: noteOptions.fields,
        tags: ["hare"],
        options: {
          allowDuplicate: true,
        },
      },
    };

    if (noteOptions.audio) {
      payload.note.audio = [
        {
          url: noteOptions.audio.url,
          filename: noteOptions.audio.filename,
          fields: noteOptions.audio.fields,
        },
      ];
    }
    const response = await axios.post(baseUrl, {
      action: "addNote",
      version: 6,
      params: payload,
    });
    return { result: response.data.result, error: response.data.error };
  } catch (e) {
    return {
      error: `Could not get available fields for the selected model from ankiconnect.`,
    };
  }
}
