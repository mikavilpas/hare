import { initial, last } from "lodash";

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
  if (parseResult.kind !== "OK") {
    console.log(parseResult.trace);
  }

  expect(parseResult).to.deep.eql({ kind: "OK", value: expected });
}

export function assertFailsParsing(parseResult) {
  expect(parseResult.isOk).to.eql(false);
}
