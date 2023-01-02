/* eslint-disable import/no-webpack-loader-syntax */

import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { pageView } from "../../telemetry";
import Navbar from "../navbar/Navbar";
import ExistingDictionary from "./dictionaries/ExistingDictionary";
import ImportDictionaryWizard from "./dictionaries/ImportDictionaryWizard";
import * as ankiconnectApi from "../../utils/ankiconnect/ankiconnectApi";
import {
  AnkiConnectSettingData,
  AnkiFieldContentType,
} from "../../utils/yomichan/yomichanDatabase";

type FieldNameSelectionProps = {
  value: string;
  onChanged: (newValue: AnkiFieldContentType) => void;
};
const FieldNameSelection = ({ value, onChanged }: FieldNameSelectionProps) => {
  return (
    <select
      onChange={(e) => {
        const newValue = e.target.value;
        const validTypes: AnkiFieldContentType[] = [
          "sentence",
          "definition",
          "englishTranslation",
          "audio",
          "word",
        ];
        if (!new Set(validTypes).has(newValue as AnkiFieldContentType)) {
          throw new Error(`Cannot set unknown field name ${newValue}`);
        }
        onChanged(newValue as AnkiFieldContentType);
      }}
      value={value}
      className="form-control"
    >
      <option value=""></option>
      <option value="sentence">sentence</option>
      <option value="definition">definition</option>
      <option value="englishTranslation">englishTranslation</option>
      <option value="audio">audio</option>
      <option value="word">word</option>
    </select>
  );
};

type AnkiConnectSettingsProps = {
  ankiConnectSettings: AnkiConnectSettingData;
  setAnkiConnectSettings: (
    newSettings: Partial<AnkiConnectSettingData>
  ) => void;
};
const AnkiConnectSettingsComponent = ({
  ankiConnectSettings,
  setAnkiConnectSettings,
}: AnkiConnectSettingsProps) => {
  const [ankiConnectError, setAnkiConnectError] = useState<string>();
  const [availableDecks, setAvailableDecks] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [availableFieldNames, setAvailableFieldNames] = useState<string[]>([]);

  const verifyConnectionToAnkiConnect = async () => {
    const baseUrl = ankiConnectSettings.address;
    const testConnectionResult = await ankiconnectApi.testConnection(baseUrl);
    setAnkiConnectError(testConnectionResult?.error);

    if (testConnectionResult.error) {
      return;
    }

    const getDecksResult = await ankiconnectApi.getDecks(baseUrl);
    setAvailableDecks(getDecksResult.result || []);
    if (getDecksResult.error) {
      setAnkiConnectError(getDecksResult.error);
      return;
    }

    const getModelsResult = await ankiconnectApi.getModels(baseUrl);
    setAvailableModels(getModelsResult.result || []);
    setAnkiConnectError(getModelsResult.error);
    if (getModelsResult.error) {
      return;
    }
  };

  useEffect(() => {
    verifyConnectionToAnkiConnect();
  }, [ankiConnectSettings?.address]);

  useEffect(() => {
    const baseUrl = ankiConnectSettings.address;
    const showModelFieldNames = async () => {
      if (!ankiConnectSettings.selectedModelName) return;

      const getModelFieldNamesResponse = await ankiconnectApi.getModelFieldNames(
        baseUrl,
        ankiConnectSettings.selectedModelName
      );
      setAnkiConnectError(getModelFieldNamesResponse.error);
      if (getModelFieldNamesResponse.error) {
        return;
      }
      setAvailableFieldNames(getModelFieldNamesResponse.result || []);
    };

    showModelFieldNames();
  }, [ankiConnectSettings?.selectedModelName, ankiConnectSettings?.address]);

  return (
    <>
      <Row>
        <Col>
          <h4>Ankiconnect</h4>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>
            Configure a connection to Anki via Ankiconnect here. This will allow
            you to quickly create cards.
          </p>
          <p>
            {ankiConnectError ? (
              <span className="d-inline-flex alert alert-warning" role="alert">
                {ankiConnectError}
              </span>
            ) : null}
          </p>
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <div className="form-group">
            <label htmlFor="address" className="mr-3">
              Address
            </label>
            <input
              className="form-control col"
              type="text"
              id="address"
              value={ankiConnectSettings.address || ""}
              onChange={(e) => {
                setAnkiConnectSettings({
                  address: e.target.value || "",
                });
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="deck" className="mr-3">
              Deck
            </label>
            <select
              className="form-control col"
              id="deck"
              value={ankiConnectSettings.selectedDeckName || ""}
              onChange={(e) => {
                setAnkiConnectSettings({
                  selectedDeckName: e.target.value || "",
                });
              }}
            >
              <option value="" />
              {availableDecks?.map((deckName) => (
                <option value={deckName} key={deckName}>
                  {deckName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="model" className="mr-3">
              Model
            </label>
            <select
              className="form-control col"
              id="model"
              value={ankiConnectSettings.selectedModelName || ""}
              onChange={(e) => {
                setAnkiConnectSettings({
                  selectedModelName: e.target.value || "",
                });
              }}
            >
              <option value="" />
              {availableModels?.map((modelName) => (
                <option value={modelName} key={modelName}>
                  {modelName}
                </option>
              ))}
            </select>
          </div>
          <table className="table table-dark table-striped">
            <thead>
              <tr>
                <th scope="col">Field</th>
                <th scope="col">Value</th>
                {/* TODO add an example column */}
              </tr>
            </thead>
            <tbody>
              {availableFieldNames?.map((fieldName) => (
                <tr key={fieldName}>
                  <th scope="row">{fieldName}</th>
                  <td>
                    <FieldNameSelection
                      value={
                        ankiConnectSettings?.fieldValueMapping?.[fieldName] ||
                        ""
                      }
                      onChanged={(newSelectionValue) => {
                        const newMapping = {
                          ...ankiConnectSettings.fieldValueMapping,
                          [fieldName]: newSelectionValue,
                        };
                        setAnkiConnectSettings({
                          fieldValueMapping: newMapping,
                        });
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Col>
      </Row>
    </>
  );
};

export default AnkiConnectSettingsComponent;
