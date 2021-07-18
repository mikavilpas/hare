import { initial, last } from "lodash";
import { defineCombinator, ParjserBase } from "parjs/internal";
import { mount } from "@cypress/react";
import ReactJson from "react-json-view";

// helper
export const joinSuccessiveStringTokens = (tokens) => {
  // join successive string tokens ("a","b" = "ab")
  return tokens.reduce((result, token) => {
    const previousToken = last(result);
    if (typeof token === "string" && typeof previousToken === "string") {
      const beforePrevious = initial(result);
      const newToken = previousToken + token;
      return [...beforePrevious, newToken];
    } else {
      return [...result, token];
    }
  }, []);
};

// for tests, TODO move to a test file
// should get optimized out of the prod build anyway
export function assertParses(parseResult, expected) {
  mount(<ReactJson src={parseResult} theme="monokai" />).then(() => {
    if (parseResult.kind !== "OK") {
      console.log(parseResult.trace);
    }

    expect(parseResult).to.deep.eql({ kind: "OK", value: expected });
  });
}

export function assertFailsParsing(parseResult) {
  expect(parseResult.isOk).to.eql(false);
}

export function called(expecting) {
  return defineCombinator((source) => {
    return new (class Called extends ParjserBase {
      type = expecting;
      expecting = expecting;

      _apply(ps) {
        source.apply(ps);
      }
    })();
  });
}
