"use strict";

const commonOptions = require("../common/common-options.js");

const CATEGORY_JAVASCRIPT = "JavaScript";

// format based on https://github.com/prettier/prettier/blob/main/src/main/core-options.js
module.exports = {
  matrixArray: {
    since: "1.0.0",
    category: CATEGORY_JAVASCRIPT,
    type: "boolean",
    default: true,
    description: "Preserves arrays that resemble a matrix.",
  },
  forceObjectBreak: {
    since: "1.0.0",
    category: CATEGORY_JAVASCRIPT,
    type: "choice",
    default: "preserve",
    description: "Controls line breaks in object literals",
    choices: [
      {
        value: "preserve",
        description:
          "Prettier's original behavior, which chooses between one-line and multi-line based on the presense of a new line after the opening '{'.",
      },
      { 
        value: "forceSingleLine", 
        description: 
          "Objects literals will always be formated to a single line." 
      },
      {
        value: "forceMultiLine",
        description:
          "Object literals will always be formatted to multiple lines, where possible.",
      },
    ],
  },
  allmanStyle: {
    since: "1.0.0",
    category: CATEGORY_JAVASCRIPT,
    type: "boolean",
    default: false,
    description: "Puts the '{' on a new line.",
  },
  arrowParens: {
    since: "1.9.0",
    category: CATEGORY_JAVASCRIPT,
    type: "choice",
    default: [
      { since: "1.9.0", value: "avoid" },
      { since: "2.0.0", value: "always" },
    ],
    description: "Include parentheses around a sole arrow function parameter.",
    choices: [
      {
        value: "always",
        description: "Always include parens. Example: `(x) => x`",
      },
      {
        value: "avoid",
        description: "Omit parens when possible. Example: `x => x`",
      },
    ],
  },
  bracketSameLine: commonOptions.bracketSameLine,
  bracketSpacing: commonOptions.bracketSpacing,
  elseStatementNewLine: {
    since: "0.0.0",
    category: CATEGORY_JAVASCRIPT,
    type: "boolean",
    description: "puts else statement on a new line instead of on the same line as if statement right bracket.",
  },
  multiEmptyLine :{
    since: "0.0.0",
    category: CATEGORY_JAVASCRIPT,
    type: "boolean",
    description: "allow empty multi-line at the start and the end of blocks."
  },
  retainBlankLines :{
    since: "0.0.0",
    category: CATEGORY_JAVASCRIPT,
    type: "boolean",
    description: "keeps multiple blank lines instead of collapsing into a single blank line"
  },
  jsxBracketSameLine: {
    since: "0.17.0",
    category: CATEGORY_JAVASCRIPT,
    type: "boolean",
    description: "Put > on the last line instead of at a new line.",
    deprecated: "2.4.0",
  },
  semi: {
    since: "1.0.0",
    category: CATEGORY_JAVASCRIPT,
    type: "boolean",
    default: true,
    description: "Print semicolons.",
    oppositeDescription:
      "Do not print semicolons, except at the beginning of lines which may need them.",
  },
  getSetOneLine: {
    since: "1.0.0",
    category: CATEGORY_JAVASCRIPT,
    type: "boolean",
    default: false,
    description: "Put getter/setter content on one line",
  },
  singleQuote: commonOptions.singleQuote,
  jsxSingleQuote: {
    since: "1.15.0",
    category: CATEGORY_JAVASCRIPT,
    type: "boolean",
    default: false,
    description: "Use single quotes in JSX.",
  },
  quoteProps: {
    since: "1.17.0",
    category: CATEGORY_JAVASCRIPT,
    type: "choice",
    default: "as-needed",
    description: "Change when properties in objects are quoted.",
    choices: [
      {
        value: "as-needed",
        description: "Only add quotes around object properties where required.",
      },
      {
        value: "consistent",
        description:
          "If at least one property in an object requires quotes, quote all properties.",
      },
      {
        value: "preserve",
        description: "Respect the input use of quotes in object properties.",
      },
    ],
  },
  trailingComma: {
    since: "0.0.0",
    category: CATEGORY_JAVASCRIPT,
    type: "choice",
    default: [
      { since: "0.0.0", value: false },
      { since: "0.19.0", value: "none" },
      { since: "2.0.0", value: "es5" },
    ],
    description: "Print trailing commas wherever possible when multi-line.",
    choices: [
      {
        value: "es5",
        description:
          "Trailing commas where valid in ES5 (objects, arrays, etc.)",
      },
      { value: "none", description: "No trailing commas." },
      {
        value: "all",
        description:
          "Trailing commas wherever possible (including function arguments).",
      },
    ],
  },
  singleAttributePerLine: commonOptions.singleAttributePerLine,
};
