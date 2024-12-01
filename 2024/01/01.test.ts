import * as fs from "fs-extra";

describe("01", () => {
  const differencesCases = [
    { input: "1 2", expected: 1 },
    { input: "1 5", expected: 4 },
    { input: "1 -1", expected: 2 },
    { input: "-1 1", expected: 2 },
  ];
  it.each(differencesCases)("calculates differences easily", (testCase) => {
    expect(calculate(testCase.input).differences).toEqual(testCase.expected);
  });

  const sortingCases = [
    { input: "1 2\n2 1", expected: 0 },
    { input: "2 1\n1 2", expected: 0 },
    { input: "2 1\n1 2", expected: 0 },
    { input: "1 1\n2 2", expected: 0 },
  ];
  it.each(sortingCases)("sorts the numbers in the columns", (testCase) => {
    expect(calculate(testCase.input).differences).toEqual(testCase.expected);
  });

  it("handles the initial test case", () => {
    const input = "3   4\n4   3\n2   5\n1   3\n3   9\n3   3";
    expect(calculate(input).differences).toEqual(11);
  });

  it("handles the initial test case (from file)", () => {
    const inputText = fs.readFileSync("./2024/01/input_small.txt").toString();
    expect(calculate(inputText).differences).toEqual(11);
  });

  it("handles 3 spaces", () => {
    expect(calculate("1000   2000").differences).toEqual(1000);
  });

  it("handles the input file", () => {
    const inputText = fs.readFileSync("./2024/01/input.txt").toString();
    expect(calculate(inputText).differences).toEqual(1319616);
    expect(calculate(inputText).similariries).toEqual(27267728);
  });

  it("calculates the similarities from a subset", () => {
    const inputText = fs.readFileSync("./2024/01/input_small.txt").toString();
    expect(calculate(inputText).similariries).toEqual(31);
  });
});

type Result = {
  differences: number;
  similariries: number;
};

function calculate(input: string): Result {
  const lines = input.split(/\n/g).filter((x) => (x ? true : false));
  let aValues: number[] = [];
  let bValues: number[] = [];
  lines.forEach((line) => {
    const [a, b] = line.split(/[ ]+/g).map((x) => parseInt(x));
    aValues.push(a);
    bValues.push(b);
  });
  aValues = aValues.sort((a, b) => a - b);
  bValues = bValues.sort((a, b) => a - b);
  const frequencyMap: Record<string, number> = bValues.reduce((map, num) => {
    map[num] = (map[num] || 0) + 1;
    return map;
  }, {});
  console.debug(frequencyMap);
  let differences: number = 0;
  let similariries: number = 0;
  for (let i = 0; i < aValues.length; i++) {
    differences += Math.abs(bValues[i] - aValues[i]);
    const search = aValues[i];
    const times = frequencyMap[search] || 0;
    similariries = similariries + search * times;
  }
  return { differences, similariries };
}
