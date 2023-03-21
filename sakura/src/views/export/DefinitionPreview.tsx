import { RefCallback, useEffect, useRef } from "react";
import * as ReactDOMClient from "react-dom/client";
import { CopyQuoteButton, SelectSentenceForAnkiCardButton } from "./ExportView";

interface DefinitionPreviewProps {
  headingHtml: string;
  bodyHtml: string;
  setDefinitionNode: React.Dispatch<
    React.SetStateAction<HTMLElement | undefined>
  >;
  selectedWord: string | undefined;
  selectedAnkiJapSentence: string | undefined;
  setSelectedAnkiJapSentence: (sentence: string | undefined) => void;
}

export const DefinitionPreview = ({
  headingHtml,
  bodyHtml,
  setDefinitionNode,
  selectedWord,
  selectedAnkiJapSentence,
  setSelectedAnkiJapSentence,
}: DefinitionPreviewProps): JSX.Element => {
  // Store the root nodes of the copy buttons so we can unmount them later.
  // This is necessary because the buttons are added to the DOM after the
  // definition is rendered, and we need to remove them when the definition
  // is unmounted in order to avoid memory leaks.
  type Sentence = string;
  const sentenceButtonsRef = useRef<Record<Sentence, ReactDOMClient.Root>>();

  useEffect(() => {
    return function cleanup() {
      Object.entries(sentenceButtonsRef.current || {}).forEach(
        ([sentence, buttonRootNode]) => {
          // Use setTimeout to avoid a warning about synchronous unmounts.
          // This may be a react bug.
          //
          // https://stackoverflow.com/questions/73459382/react-18-async-way-to-unmount-root
          // https://github.com/facebook/react/issues/25675
          setTimeout(() => {
            buttonRootNode.unmount();
            delete sentenceButtonsRef.current?.[sentence];
          });
        }
      );
    };
  }, []);

  const onRefChange: RefCallback<HTMLDivElement> = (node) => {
    // add extra buttons to the example sentences
    setDefinitionNode(node || undefined);

    if (!node) return;
    if (!sentenceButtonsRef.current) sentenceButtonsRef.current = {};

    const quoteActions = Array.from(node.querySelectorAll(".quote-actions"));
    quoteActions.forEach((e: Element) => {
      const spanElement = e as HTMLSpanElement;

      const sentence = spanElement.dataset.quote;
      if (!sentence) return;

      let root: ReactDOMClient.Root;
      if (sentenceButtonsRef.current?.[sentence]) {
        root = sentenceButtonsRef.current[sentence];
      } else {
        // the root can be undefined in case the sentence is not in the ref, i.e.
        // it's not been rendered before
        root = ReactDOMClient.createRoot(spanElement);
      }

      root.render(
        <div>
          <CopyQuoteButton text={sentence} selectedWord={selectedWord || ""} />
          <SelectSentenceForAnkiCardButton
            onSelect={() => setSelectedAnkiJapSentence(sentence)}
            isSelected={sentence === selectedAnkiJapSentence}
          />
        </div>
      );

      if (sentenceButtonsRef.current) {
        sentenceButtonsRef.current[sentence] = root;
      }
    });
  };

  return (
    <div className="card-body" ref={onRefChange}>
      <h3
        className="card-title"
        dangerouslySetInnerHTML={{
          __html: headingHtml,
        }}
      ></h3>
      <p
        className="card-text"
        dangerouslySetInnerHTML={{
          __html: bodyHtml,
        }}
      ></p>
    </div>
  );
};
