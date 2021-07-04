import * as p from "parjs";
import { mapConst } from "parjs/combinators";

export const tokenFactory = {
  firstLevelDefinition: (content, heading) => ({
    type: "firstLevelDefinition",
    content: content,
    heading: heading,
  }),
  secondLevelDefinition: (i, content, heading) => ({
    type: "secondLevelDefinition",
    number: i,
    content: content,
    heading: heading,
  }),
  thirdLevelDefinition: (content, heading) => ({
    type: "thirdLevelDefinition",
    content: content,
    heading: heading,
  }),
};

export const linebreak = p.newline().pipe(mapConst({ type: "linebreak" }));
