import React from "react";
import { CopyQuoteButton, SelectSentenceForAnkiCardButton } from "./ExportView";

interface ResultItemSectionProps {
  sentence: string;
  selectedAnkiSentence?: string;
  setSelectedAnkiSentence: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
}
export const ResultItemSection = ({
  sentence,
  selectedAnkiSentence,
  setSelectedAnkiSentence,
}: ResultItemSectionProps) => {
  return (
    <>
      <span className="p-1 text-secondary mr-1">{sentence}</span>
      <div className="d-flex flex-row flex-md-column justify-content-center">
        <CopyQuoteButton text={sentence} />

        <SelectSentenceForAnkiCardButton
          onSelect={() => setSelectedAnkiSentence(sentence)}
          isSelected={sentence === selectedAnkiSentence}
        />
      </div>
    </>
  );
};
