"use strict";

const { printDanglingComments } = require("../../main/comments.js");
const {
  builders: { line, softline, hardline, group, indent, ifBreak, fill },
} = require("../../document/index.js");
const { getLast, hasNewline } = require("../../common/util.js");
const {
  shouldPrintComma,
  hasComment,
  CommentCheckFlags,
  isNextLineEmpty,
  isNumericLiteral,
  isSignedNumericLiteral,
} = require("../utils/index.js");
const { locStart, locEnd } = require("../loc.js");

const { printOptionalToken, printTypeAnnotation } = require("./misc.js");

/** @typedef {import("../../document").Doc} Doc */

function printArray(path, options, print) {
  const node = path.getValue();
  /** @type{Doc[]} */
  const parts = [];

  const openBracket = node.type === "TupleExpression" ? "#[" : "[";
  const closeBracket = "]";
  if (node.elements.length === 0) {
    if (!hasComment(node, CommentCheckFlags.Dangling)) {
      parts.push(openBracket, closeBracket);
    } else {
      parts.push(
        group([
          openBracket,
          printDanglingComments(path, options),
          softline,
          closeBracket,
        ])
      );
    }
  } else {
    const lastElem = getLast(node.elements);
    const canHaveTrailingComma = !(lastElem && lastElem.type === "RestElement");

    // JavaScript allows you to have empty elements in an array which
    // changes its length based on the number of commas. The algorithm
    // is that if the last argument is null, we need to force insert
    // a comma to ensure JavaScript recognizes it.
    //   [,].length === 1
    //   [1,].length === 1
    //   [1,,].length === 2
    //
    // Note that getLast returns null if the array is empty, but
    // we already check for an empty array just above so we are safe
    const needsForcedTrailingComma = lastElem === null;

    const groupId = Symbol("array");

    const shouldBreak =
      !options.__inJestEach &&
      node.elements.length > 1 &&
      node.elements.every((element, i, elements) => {
        const elementType = element && element.type;
        if (
          elementType !== "ArrayExpression" &&
          elementType !== "ObjectExpression"
        ) {
          return false;
        }

        const nextElement = elements[i + 1];
        if (nextElement && elementType !== nextElement.type) {
          return false;
        }

        const itemsKey =
          elementType === "ArrayExpression" ? "elements" : "properties";

        return element[itemsKey] && element[itemsKey].length > 1;
      });

    const shouldUseConciseFormatting = isConciselyPrintedArray(node, options);

    const trailingComma = !canHaveTrailingComma
      ? ""
      : needsForcedTrailingComma
      ? ","
      : !shouldPrintComma(options)
      ? ""
      : shouldUseConciseFormatting
      ? ifBreak(",", "", { groupId })
      : ifBreak(",");

    parts.push(
      group(
        [
          openBracket,
          indent([
            softline,
            shouldUseConciseFormatting
              ? printArrayItemsConcisely(path, options, print, trailingComma)
              : [
                  printArrayItems(path, options, "elements", print),
                  trailingComma,
                ],
            printDanglingComments(path, options, /* sameIndent */ true),
          ]),
          softline,
          closeBracket,
        ],
        { shouldBreak, id: groupId }
      )
    );
  }

  parts.push(
    printOptionalToken(path),
    printTypeAnnotation(path, options, print)
  );

  return parts;
}

function isConciselyPrintedArray(node, options) {
  return (
    node.elements.length > 1 &&
    node.elements.every(
      (element) =>
        element &&
        (isNumericLiteral(element) ||
          (isSignedNumericLiteral(element) && !hasComment(element.argument))) &&
        !hasComment(
          element,
          CommentCheckFlags.Trailing | CommentCheckFlags.Line,
          (comment) =>
            !hasNewline(options.originalText, locStart(comment), {
              backwards: true,
            })
        )
    )
  );
}

function isMatrixArray(path, options) {
  if (!isConciselyPrintedArray(path.getValue(), options)) {
    return false;
  }

  let rowElements = [];
  let startRow = -1;

  // We have to go through each loop, because return-ing midway will leave to undefined behavior
  // for the rest of the iterations.
  path.each((childPath, i, elements) => {
    if (startRow === -1) {
      startRow = elements[i].loc.start.line;
    }

    if (elements[i].loc.start.line - startRow >= rowElements.length) {
      rowElements.push(1);
    } else {
      rowElements[rowElements.length - 1] = rowElements[rowElements.length - 1] + 1;
    }
  }, "elements");

  for (let i = 0; i < rowElements.length - 1; i++) {
    if (rowElements[i] !== rowElements[i + 1]) {
      return false;
    }
  }

  return true;
}

function printArrayItems(path, options, printPath, print) {
  const printedElements = [];
  let separatorParts = [];

  path.each((childPath) => {
    printedElements.push(separatorParts, group(print()));

    separatorParts = [",", line];
    if (
      childPath.getValue() &&
      isNextLineEmpty(childPath.getValue(), options)
    ) {
      separatorParts.push(softline);
    }
  }, printPath);

  return printedElements;
}

function printArrayItemsConcisely(path, options, print, trailingComma) {
  const parts = [];

  if (options.matrixArray && isMatrixArray(path, options)) {
    path.each((childPath, i, elements) => {
      const isLast = i === elements.length - 1;

      parts.push([print(), isLast ? trailingComma : ","]);

      if (!isLast) {
        parts.push(
          i + 1 >= elements.length
            ? line
            : (elements[i].loc.start.line === elements[i + 1].loc.start.line)
              ? line
              : hardline
        );
      }
    }, "elements");
  } else {
    path.each((childPath, i, elements) => {
      const isLast = i === elements.length - 1;

      parts.push([print(), isLast ? trailingComma : ","]);

      if (!isLast) {
        parts.push(
          isNextLineEmpty(childPath.getValue(), options)
            ? [hardline, hardline]
            : hasComment(
              elements[i + 1],
              CommentCheckFlags.Leading | CommentCheckFlags.Line
            )
              ? hardline
              : line
        );
      }
    }, "elements");
  }

  return fill(parts);
}

module.exports = { printArray, printArrayItems, isConciselyPrintedArray };
