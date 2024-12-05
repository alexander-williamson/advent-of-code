import * as fs from "fs";

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
    expect(getStrings(basic_dot_example).diagTopLeftToBottomRight).toEqual([".", "..", ".SX", "XAA.", ".M.M.", ""]);
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

function getStrings(input: string): Result {
  const lines = input
    .split(`\n`)
    .map((x) => x.trim())
    .filter((x) => x.length > 0);

  // down
  let leftToRight: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    leftToRight.push(lines[i]);
  }
  let rightToLeft: string[] = [...leftToRight.map((x) => [...x].reverse().join(""))];
  // across
  let topToBottom: string[] = [];
  for (let i = 0; i < lines[0].length; i++) {
    let str = "";
    for (let j = 0; j < lines.length; j++) {
      str += lines[j][i];
    }
    topToBottom.push(str);
  }
  let bottomToTop: string[] = [...topToBottom.map((x) => [...x].reverse().join(""))];
  // diagonal top left to bottom right

  const diagTopLeftToBottomRight: string[] = [];
  for (let x = 0; x < lines[0].length; x++) {
    let str = "";
    for (let y = 0; y < lines.length; y++) {
      console.debug(lines[x]);
      //   str += lines[x][y];
    }
    diagTopLeftToBottomRight.push(str);
  }
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
