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
