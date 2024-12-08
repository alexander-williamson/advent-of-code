import * as fs from "fs";

const basic_h = fs.readFileSync("2024/04/basic_h.txt").toString();
const basic_w = fs.readFileSync("2024/04/basic_w.txt").toString();
const basic_dot_example = fs.readFileSync("2024/04/basic_dot_example.txt").toString();

// describe("getStrings", () => {
//   it("returns all horizontal leftToRight strings", () => {
//     expect(getStrings(basic_dot_example).leftToRight).toEqual(["..X...", ".SAMX.", ".A..A.", "XMAS.S", ".X...."]);
//   });
//   it("returns all rightToLeft strings", () => {
//     expect(getStrings(basic_dot_example).rightToLeft).toEqual(["...X..", ".XMAS.", ".A..A.", "S.SAMX", "....X."]);
//   });
//   it("returns all topToBottom strings", () => {
//     expect(getStrings(basic_dot_example).topToBottom).toEqual(["...X.", ".SAMX", "XA.A.", ".M.S.", ".XA..", "...S."]);
//   });
//   it("returns all bottomToTop strings", () => {
//     expect(getStrings(basic_dot_example).bottomToTop).toEqual([".X...", "XMAS.", ".A.AX", ".S.M.", "..AX.", ".S..."]);
//   });
//   it("returns all diagTopLeftToBottomRight strings", () => {
//     expect(getStrings(basic_dot_example).diagTopLeftToBottomRight).toEqual([".", "..", ".SX", "XAA.", ".M.M.", "XA.X.", ".SA.", "...", ".S", "."]);
//   });
// });

describe("diagTopLeftToBottomRight", () => {
  it("returns the right values for a basic dot grid", () => {
    expect(diagTopLeftToBottomRight(getLines(basic_w))).toEqual(["A", "BF", "CGK", "DHL", "EIM", "JN", "O"]);
  });
  it("returns the right values for a basic dot grid", () => {
    expect(diagTopLeftToBottomRight(getLines(basic_h))).toEqual(["A", "BD", "CEG", "FHJ", "IKM", "LN", "O"]);
  });
});

describe("diagTopRightToBottomLeft", () => {
  it("returns the right values for a basic dot grid", () => {
    expect(diagTopRightToBottomLeft(getLines(basic_w))).toEqual(["E", "DJ", "CIO", "BHN", "AGM", "FL", "K"]);
  });
  it("returns the right values for a basic dot grid", () => {
    expect(diagTopRightToBottomLeft(getLines(basic_h))).toEqual(["C", "BF", "AEI", "DHL", "GKO", "JN", "M"]);
  });
});

describe("diagBottomLeftToTopRight", () => {
  it("returns the right values for a basic dot grid", () => {
    expect(diagBottomLeftToTopRight(getLines(basic_w))).toEqual(["K", "LF", "MGA", "NHB", "OIC", "JD", "E"]);
  });
  it("returns the right values for a basic dot grid", () => {
    expect(diagBottomLeftToTopRight(getLines(basic_h))).toEqual(["M", "NJ", "OKG", "LHD", "IEA", "FB", "C"]);
  });
});

function diagBottomLeftToTopRight(lines: string[]): string[] {
  const transformedLines = [...lines].reverse();
  return diagTopLeftToBottomRight(transformedLines);
}

function diagTopLeftToBottomRight(lines: string[]): string[] {
  let words: string[] = [];
  let added = lines[0].length + lines.length;
  for (let iteration = 0; iteration < added - 1; iteration++) {
    let word = "";

    let firstX = iteration;
    let firstY = 0;

    let lastX = firstX - (lines.length - 1);
    let lastY = lines.length - 1;

    let x = firstX;
    let y = firstY;

    while (x >= lastX && y <= lastY) {
      if (lines[y] && lines[y][x]) {
        word += lines[y][x];
      }
      x--;
      y++;
    }
    words.push(word);
  }
  return words;
}

function diagTopRightToBottomLeft(lines: string[]): string[] {
  const reversedLines = lines.map((line) => line.split("").reverse().join(""));
  return diagTopLeftToBottomRight(reversedLines);
}

function getLines(input: string): string[] {
  return input
    .split(`\n`)
    .map((x) => x.trim())
    .filter((x) => x.length > 0);
}

// function getStrings(input: string): Result {
//   const lines = input
//     .split(`\n`)
//     .map((x) => x.trim())
//     .filter((x) => x.length > 0);

//   // down
//   const leftToRight: string[] = [];
//   for (let i = 0; i < lines.length; i++) {
//     leftToRight.push(lines[i]);
//   }
//   const rightToLeft: string[] = [...leftToRight.map((x) => [...x].reverse().join(""))];

//   // across
//   const topToBottom: string[] = [];
//   for (let i = 0; i < lines[0].length; i++) {
//     let str = "";
//     for (let j = 0; j < lines.length; j++) {
//       str += lines[j][i];
//     }
//     topToBottom.push(str);
//   }
//   const bottomToTop: string[] = [...topToBottom.map((x) => [...x].reverse().join(""))];

//   // diagonal top left to bottom right
//   const _diagTopLeftToBottomRight = diagTopLeftToBottomRight(lines);

//   // diagonal top right to bottom left
//   const _diagTopRightToBottomLeft = diagTopRightToBottomLeft(lines);

//   return {
//     topToBottom,
//     bottomToTop,
//     leftToRight,
//     rightToLeft,
//     diagBottomLeftToTopRight: _diagTopLeftToBottomRight.reverse(),
//     diagBottomRightToTopLeft: _diagTopRightToBottomLeft.reverse(),
//     diagTopLeftToBottomRight: _diagTopLeftToBottomRight,
//     diagTopRightToBottomLeft: _diagTopRightToBottomLeft,
//   };
// }
