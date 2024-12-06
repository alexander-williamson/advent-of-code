import * as fs from "fs";

const basic_h = fs.readFileSync("2024/04/basic_h.txt").toString();
const basic_w = fs.readFileSync("2024/04/basic_w.txt").toString();
const basic_dot_example = fs.readFileSync("2024/04/basic_dot_example.txt").toString();

describe("getStrings", () => {
  it("returns all horizontal leftToRight strings", () => {
    expect(getStrings(basic_dot_example).leftToRight).toEqual(["..X...", ".SAMX.", ".A..A.", "XMAS.S", ".X...."]);
  });
  it("returns all rightToLeft strings", () => {
    expect(getStrings(basic_dot_example).rightToLeft).toEqual(["...X..", ".XMAS.", ".A..A.", "S.SAMX", "....X."]);
  });
  it("returns all topToBottom strings", () => {
    expect(getStrings(basic_dot_example).topToBottom).toEqual(["...X.", ".SAMX", "XA.A.", ".M.S.", ".XA..", "...S."]);
  });
  it("returns all bottomToTop strings", () => {
    expect(getStrings(basic_dot_example).bottomToTop).toEqual([".X...", "XMAS.", ".A.AX", ".S.M.", "..AX.", ".S..."]);
  });
  it("returns all diagTopLeftToBottomRight strings", () => {
    expect(getStrings(basic_dot_example).diagTopLeftToBottomRight).toEqual([".", "..", ".SX", "XAA.", ".M.M.", "XA.X.", ".SA.", "...", ".S", "."]);
  });
});

describe("diagTopLeftToBottomRight", () => {
  it("returns the right values for a basic dot grid", () => {
    expect(diagTopLeftToBottomRight(getLines(basic_w))).toEqual(["A", "FB", "KGC", "LHD", "MIE", "NJ", "O"]);
  });
  it("returns the right values for a basic dot grid", () => {
    expect(diagTopLeftToBottomRight(getLines(basic_h))).toEqual(["A", "DB", "GEC", "JHF", "MKI", "NL", "O"]);
  });
});

describe.only("diagTopRightToBottomLeft", () => {
  it("returns the right values for a basic dot grid", () => {
    expect(diagTopRightToBottomLeft(getLines(basic_w))).toEqual(["E", "DJ", "CIO", "BHN", "AGM", "FL", "K"]);
  });
});

type Result = {
  topToBottom: string[];
  bottomToTop: string[];
  leftToRight: string[];
  rightToLeft: string[];
  diagTopLeftToBottomRight: string[];
  diagTopRightToBottomLeft: string[];
  diagBottomLeftToTopRight: string[];
  diagBottomRightToTopLeft: string[];
};

function diagTopRightToBottomLeft(lines: string[]): string[] {
  let words: any[] = [];
  for (let across = lines[0].length - 1; across > -1; across--) {
    let word = "";
    let x = across;
    let y = 0;
    while (y < across && x > lines[0].length - across) {
      word += lines[y][x];
      x = x - 1;
      y = y + 1;
    }
    words.push(word);
  }
  // for (let down = 0; down < lines.length; down++) {
  //   let word = "";
  //   let y = down;
  //   let x = lines[0].length - 1;
  //   while (y > -1 && x > -1) {
  //     word += lines[y][x];
  //     x = x - 1;
  //     y = y - 1;
  //   }
  //   words.push(word);
  // }
  return words;
}

function diagTopLeftToBottomRight(lines: string[]): string[] {
  let words: any[] = [];
  for (let down = 0; down < lines.length; down++) {
    let word = "";
    let y = down;
    let x = 0;
    while (y > -1 && x < lines[0].length) {
      word += lines[y][x];
      x = x + 1;
      y = y - 1;
    }
    words.push(word);
  }
  for (let across = 1; across < lines[0].length; across++) {
    let word = "";
    let x = across;
    let y = lines.length - 1;
    while (x < lines[0].length && y > -1) {
      word += lines[y][x];
      x = x + 1;
      y = y - 1;
    }
    words.push(word);
  }
  return words;
}

function getLines(input: string): string[] {
  return input
    .split(`\n`)
    .map((x) => x.trim())
    .filter((x) => x.length > 0);
}

function getStrings(input: string): Result {
  const lines = input
    .split(`\n`)
    .map((x) => x.trim())
    .filter((x) => x.length > 0);

  // down
  const leftToRight: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    leftToRight.push(lines[i]);
  }
  const rightToLeft: string[] = [...leftToRight.map((x) => [...x].reverse().join(""))];

  // across
  const topToBottom: string[] = [];
  for (let i = 0; i < lines[0].length; i++) {
    let str = "";
    for (let j = 0; j < lines.length; j++) {
      str += lines[j][i];
    }
    topToBottom.push(str);
  }
  const bottomToTop: string[] = [...topToBottom.map((x) => [...x].reverse().join(""))];

  return {
    topToBottom,
    bottomToTop,
    leftToRight,
    rightToLeft,
    diagBottomLeftToTopRight: [],
    diagBottomRightToTopLeft: [],
    diagTopLeftToBottomRight: [],
    diagTopRightToBottomLeft: [],
  };
}
