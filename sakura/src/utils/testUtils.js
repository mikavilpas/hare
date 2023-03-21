import ReactJson from "react-json-view";

export function assertParses(parseResult, expected) {
  cy.mount(<ReactJson src={parseResult} theme="monokai" />).then(() => {
    if (parseResult.kind !== "OK") {
      console.log(parseResult.trace);
    }

    expect(parseResult).to.deep.eql({ kind: "OK", value: expected });
  });
}

export function assertFailsParsing(parseResult) {
  expect(parseResult.isOk).to.eql(false);
}
