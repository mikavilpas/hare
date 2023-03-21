import { initial, last } from "lodash";
import { ParjserBase, defineCombinator } from "parjs/internal";

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
