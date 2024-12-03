import * as fs from "fs-extra";
import * as path from "path";

let input_small = fs
  .readFileSync(path.join(__dirname, "./input_small.txt"))
  .toString();

let input_large = fs
  .readFileSync(path.join(__dirname, "./input.txt"))
  .toString();

describe("calculateSameDirection", () => {
  it("calculates correct when tolerance 0", () => {
    expect(calculateSameDirection([1, 2, 3, 4, 5])).toBe(5);
    expect(calculateSameDirection([1, 2, 2, 3, 4])).toBe(4);
    expect(calculateSameDirection([5, 4, 3, 2, 1])).toBe(5);
    expect(calculateSameDirection([4, 3, 3, 2, 1])).toBe(4);
  });
});

describe("calculateSafeDifference", () => {
  it("calculates correct when tolerance 0", () => {
    expect(calculateSafeDifference([7, 6, 4, 2, 1])).toBe(5);
    expect(calculateSafeDifference([1, 2, 7, 8, 9])).toBe(4);
    expect(calculateSafeDifference([9, 7, 6, 2, 1])).toBe(4);
    expect(calculateSafeDifference([1, 3, 2, 4, 5])).toBe(5);
    expect(calculateSafeDifference([8, 6, 4, 4, 1])).toBe(4);
    expect(calculateSafeDifference([1, 3, 6, 7, 9])).toBe(5);
  });
});

describe("splitLines", () => {
  it("splits the input file correctly", () => {
    expect(splitLines(input_small)).toEqual([
      [7, 6, 4, 2, 1],
      [1, 2, 7, 8, 9],
      [9, 7, 6, 2, 1],
      [1, 3, 2, 4, 5],
      [8, 6, 4, 4, 1],
      [1, 3, 6, 7, 9],
    ]);
  });
});

describe("diffSafe", () => {
  it.each([
    { input: 0, expected: false },
    { input: 1, expected: true },
    { input: 2, expected: true },
    { input: 3, expected: true },
    { input: 4, expected: false },
  ])("returns true if the gap is between 1 and 3 - %o", (testCase) => {
    expect(isSafeDifference(0, testCase.input)).toBe(testCase.expected);
  });
});

describe("calculator", () => {
  it("calculates the correct result for lines", () => {
    expect(calculate("7 6 4 2 1")).toEqual(1);
    expect(calculate("1 2 7 8 9")).toEqual(0);
    expect(calculate("9 7 6 2 1")).toEqual(0);
    expect(calculate("1 3 2 4 5")).toEqual(0);
    expect(calculate("8 6 4 4 1")).toEqual(0);
    expect(calculate("1 3 6 7 9")).toEqual(1);
  });
  it("calculates the correct result for small input value file", () => {
    expect(calculate(input_small)).toEqual(2);
  });
  it("calculates result of large file", () => {
    expect(calculate(input_large)).toEqual(299);
  });
  it("allows the tolerance of one bad value", () => {
    expect(calculate("7 6 4 2 1", 1)).toEqual(1);
    expect(calculate("1 2 7 8 9", 1)).toEqual(0);
    expect(calculate("9 7 6 2 1", 1)).toEqual(0);
    expect(calculate("1 3 2 4 5", 1)).toEqual(1);
    expect(calculate("8 6 4 4 1", 1)).toEqual(1);
    expect(calculate("1 3 6 7 9", 1)).toEqual(1);
  });
  it("allows the tolerance for a small input value file", () => {
    expect(calculate(input_small, 1)).toEqual(4);
  });
  it("allows the tolerance for a large input value file", () => {
    expect(calculate(input_large, 1)).toEqual(364);
  });
});

function calculate(inputText: string, tolerance: number = 0): number {
  const lines: number[][] = splitLines(inputText);
  let result = 0;
  for (let i = 0; i < lines.length; i++) {
    if (tolerance === 0) {
      const numSameDirection = calculateSameDirection(lines[i]);
      const numSafeDistances = calculateSafeDifference(lines[i]);
      const requiredValid = lines[i].length * 2 - tolerance;
      if (numSameDirection + numSafeDistances >= requiredValid) {
        result += 1;
      }
    } else {
      let valid: boolean = false;
      for (let s = 0; s < lines[i].length; s++) {
        const arr = [...lines[i]];
        arr.splice(s, 1);
        const numSameDirection = calculateSameDirection(arr);
        const numSafeDistances = calculateSafeDifference(arr);
        const requiredValid = lines[i].length * 2 - tolerance - 1;
        if (numSameDirection + numSafeDistances >= requiredValid) {
          valid = true;
        }
      }
      if (valid) result += 1;
    }
  }
  return result;
}

function calculateSafeDifference(input: number[]): number {
  let safeCount = 0;
  for (let i = 0; i < input.length; i++) {
    let a = input[i];
    let b = input[i + 1];
    const isSafe = isSafeDifference(a, b);
    safeCount += isSafe ? 1 : 0;
  }
  return safeCount;
}

function splitLines(inputText: string): number[][] {
  return inputText.split("\n").map((x) => x.split(" ").map((x) => parseInt(x)));
}

function isSafeDifference(a: number, b: number): boolean {
  if (b === undefined) return true;
  const diff = Math.abs(a - b);
  if (diff >= 1 && diff <= 3) return true;
  return false;
}

function calculateSameDirection(input: number[]): number {
  let firstDirectionAsc = input[0] < input[1];
  let result = 0;
  for (let i = 0; i < input.length; i++) {
    let current = input[i];
    let next = input[i + 1];
    const equal = current === next;
    const isLast = i === input.length - 1;
    const correctlyAscending = firstDirectionAsc && next > current;
    const correctlyDescending = firstDirectionAsc === false && next < current;
    const isValid =
      !equal && (correctlyAscending || correctlyDescending || isLast);
    result += isValid ? 1 : 0;
  }
  return result;
}
