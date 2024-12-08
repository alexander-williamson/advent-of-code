import * as fs from "fs";

const basic_h = fs.readFileSync("2024/04/basic_h.txt").toString();
const basic_w = fs.readFileSync("2024/04/basic_w.txt").toString();
const input_10_lines = fs.readFileSync("2024/04/input_10_lines.txt").toString();
const input_10_lines_90 = fs.readFileSync("2024/04/input_10_lines_90.txt").toString();
const input = fs.readFileSync("2024/04/input.txt").toString();

const LOOK_AHEAD_REGEX = /(?=(XMAS|SAMX))/g;

describe("part one", () => {
  describe("countWords", () => {
    it("finds XMAS 18 times", () => {
      const strings = getStrings(getLines(input_10_lines));

      const result = countWords(strings, LOOK_AHEAD_REGEX);

      expect(result).toEqual(18);
    });

    it("finds XMAS 18 times (90 deg rotated)", () => {
      const strings = getStrings(getLines(input_10_lines_90));

      const result = countWords(strings, LOOK_AHEAD_REGEX);

      expect(result).toEqual(18);
    });

    it("solves input", () => {
      const strings = getStrings(getLines(input));

      const result = countWords(strings, LOOK_AHEAD_REGEX);

      expect(result).toEqual(2517);
    });

    it("returns the right words for 10x10", () => {
      const strings = getStrings(getLines(input_10_lines));

      expect(strings).toEqual([
        "MMMSXXMASM",
        "MSAMXMSMSA",
        "AMXSXMAAMM",
        "MSAMASMSMX",
        "XMASAMXAMM",
        "XXAMMXXAMA",
        "SMSMSASXSS",
        "SAXAMASAAA",
        "MAMMMXMMMM",
        "MXMXAXMASX",
        "MMAMXXSSMM",
        "MSMSMXMAAX",
        "MAXAAASXMM",
        "SMSMSMMAMX",
        "XXXAAMSMMA",
        "XMMSMXAAXX",
        "MSAMXXSSMM",
        "AMASAAXAMA",
        "SSMMMMSAMS",
        "MAMXMASAMX",
        "M",
        "MM",
        "MSA",
        "SAMM",
        "XMXSX",
        "XXSAMX",
        "MMXMAXS",
        "ASMASAMS",
        "SMASAMSAM",
        "MSAMMMMXAM",
        "AMSXXSAMX",
        "MMAXAMMM",
        "XMASAMX",
        "MMXSXA",
        "ASAMX",
        "SAMM",
        "AMA",
        "MS",
        "X",
        "M",
        "SA",
        "ASM",
        "MMMX",
        "XSAMM",
        "XMASMA",
        "SXMMAMS",
        "MMXSXASA",
        "MASAMXXAM",
        "MSXMAXSAMX",
        "MMASMASMS",
        "ASAMSAMA",
        "MMAMMXM",
        "XXSAMX",
        "XMXMA",
        "SAMX",
        "SAM",
        "MX",
        "M",
      ]);
    });

    describe("getStrings", () => {
      it("returns the correct strings for a simple w grid", () => {
        expect(getStrings(getLines(basic_w))).toEqual([
          "ABCDE",
          "FGHIJ",
          "KLMNO",
          "AFK",
          "BGL",
          "CHM",
          "DIN",
          "EJO",
          "A",
          "BF",
          "CGK",
          "DHL",
          "EIM",
          "JN",
          "O",
          "E",
          "DJ",
          "CIO",
          "BHN",
          "AGM",
          "FL",
          "K",
        ]);
        expect(getStrings(getLines(basic_h))).toEqual([
          "ABC",
          "DEF",
          "GHI",
          "JKL",
          "MNO",
          "ADGJM",
          "BEHKN",
          "CFILO",
          "A",
          "BD",
          "CEG",
          "FHJ",
          "IKM",
          "LN",
          "O",
          "C",
          "BF",
          "AEI",
          "DHL",
          "GKO",
          "JN",
          "M",
        ]);
      });
    });
  });

  describe("down", () => {
    it("returns down words", () => {
      expect(down(getLines(basic_w))).toEqual(["AFK", "BGL", "CHM", "DIN", "EJO"]);
    });
  });

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

  describe("diagBottomRightToTopLeft", () => {
    it("returns the right values for a basic dot grid", () => {
      expect(diagBottomRightToTopLeft(getLines(basic_w))).toEqual(["O", "NJ", "MIE", "LHD", "KGC", "FB", "A"]);
    });
    it("returns the right values for a basic dot grid", () => {
      expect(diagBottomRightToTopLeft(getLines(basic_h))).toEqual(["O", "NL", "MKI", "JHF", "GEC", "DB", "A"]);
    });
  });

  function countWords(input: string[], regex: RegExp): number {
    const mapped = input.map((x) => [...x.matchAll(regex)]);
    const filtered = mapped.filter((x) => x.length > 0);
    const length = filtered.reduce((acc, curr) => {
      return acc + curr.length;
    }, 0);
    return length;
  }

  function getStrings(input: string[]): string[] {
    const leftToRight = input;
    const topToBottom = down(input);
    const tlbr = diagTopLeftToBottomRight(input);
    const trbl = diagTopRightToBottomLeft(input);
    return [...leftToRight, ...topToBottom, ...tlbr, ...trbl];
  }

  function down(input: string[]): string[] {
    const words = [];
    for (let x = 0; x < input[0].length; x++) {
      let word = "";
      for (let y = 0; y < input.length; y++) {
        word += input[y][x];
      }
      words.push(word);
    }
    return words;
  }

  function diagTopRightToBottomLeft(lines: string[]): string[] {
    const reversedLines = [...lines].map((line) => line.split("").reverse().join(""));
    return diagTopLeftToBottomRight(reversedLines);
  }

  function diagBottomLeftToTopRight(lines: string[]): string[] {
    const transformedLines = [...lines].reverse();
    return diagTopLeftToBottomRight(transformedLines);
  }

  function diagBottomRightToTopLeft(lines: string[]): string[] {
    const transformedLines = [...lines].reverse().map((line) => line.split("").reverse().join(""));
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
});

describe("part two", () => {
  describe("xmas cross finder", () => {
    it("returns the number of crosses for a simple input", () => {
      const count = getCross(getLines(input_10_lines));

      expect(count).toEqual(9);
    });

    it("returns the number of crosses for a simple input", () => {
      const count = getCross(getLines(input));

      expect(count).toEqual(1960);
    });
  });

  function getCross(lines: string[]): number {
    let count = 0;
    for (let y = 1; y < lines.length - 1; y++) {
      for (let x = 1; x < lines[0].length - 1; x++) {
        const current = lines[y][x];
        if (current === "A") {
          const tl = lines[y - 1][x - 1];
          const tr = lines[y - 1][x + 1];
          const bl = lines[y + 1][x - 1];
          const br = lines[y + 1][x + 1];
          const tlbr = `${tl}${current}${br}`;
          const bltr = `${bl}${current}${tr}`;
          const tlbrMatch = tlbr === "MAS" || tlbr === "SAM";
          const bltrMatch = bltr === "MAS" || bltr === "SAM";
          if (tlbrMatch && bltrMatch) {
            count = count + 1;
          }
        }
      }
    }
    return count;
  }
});

function getLines(input: string): string[] {
  return input
    .split(`\n`)
    .map((x) => x.trim())
    .filter((x) => x.length > 0);
}
