import { AnkiFieldContentType } from "../../utils/yomichan/YomichanDictionary";

interface Props {
  fieldName: string;
  value: AnkiFieldContentType;
  onChanged: (newValue: AnkiFieldContentType) => void;
}

export const FieldNameSelection = ({ fieldName, value, onChanged }: Props) => {
  return (
    <select
      data-field-name={fieldName}
      onChange={(e) => {
        const newValue = e.target.value;
        const validTypes: AnkiFieldContentType[] = [
          "(empty)",
          "sentence",
          "definition",
          "englishTranslation",
          "audio",
          "word",
        ];
        if (
          newValue &&
          newValue !== "" &&
          !new Set(validTypes).has(newValue as AnkiFieldContentType)
        ) {
          throw new Error(`Cannot set unknown field name ${newValue}`);
        }
        onChanged(newValue as AnkiFieldContentType);
      }}
      value={value}
      className="form-control"
    >
      <option value="(empty)"></option>
      <option value="sentence">sentence</option>
      <option value="definition">definition</option>
      <option value="englishTranslation">englishTranslation</option>
      <option value="audio">audio</option>
      <option value="word">word</option>
    </select>
  );
};
