import fs from "fs-extra";

const basic_rules = fs.readFileSync("2024/05/basic_rules.txt").toString();
const input = fs.readFileSync("2024/05/input.txt").toString();

describe("part one", () => {
  describe("parseFile", () => {
    const result = parseFile(basic_rules);

    it("parses the basic rules", () => {
      expect(result.rules).toEqual([
        { left: 47, right: 53 },
        { left: 97, right: 13 },
        { left: 97, right: 61 },
        { left: 97, right: 47 },
        { left: 75, right: 29 },
        { left: 61, right: 13 },
        { left: 75, right: 53 },
        { left: 29, right: 13 },
        { left: 97, right: 29 },
        { left: 53, right: 29 },
        { left: 61, right: 53 },
        { left: 97, right: 53 },
        { left: 61, right: 29 },
        { left: 47, right: 13 },
        { left: 75, right: 47 },
        { left: 97, right: 75 },
        { left: 47, right: 61 },
        { left: 75, right: 61 },
        { left: 47, right: 29 },
        { left: 75, right: 13 },
        { left: 53, right: 13 },
      ]);
    });
    it("parses the updates", () => {
      expect(result.updates).toEqual([
        [75, 47, 61, 53, 29],
        [97, 61, 53, 29, 13],
        [75, 29, 13],
        [75, 97, 47, 61, 53],
        [61, 13, 29],
        [97, 13, 75, 29, 47],
      ]);
    });
  });

  describe("validateUpdates", () => {
    const testCases: { label: string; rules: Rule[]; updates: Update[]; expectedResults: ValidateResultItem[] }[] = [
      {
        label: "two rules",
        rules: [
          { left: 10, right: 20 },
          { left: 10, right: 50 },
        ],
        updates: [[10, 20, 30, 40, 50]],
        expectedResults: [{ original: [10, 20, 30, 40, 50], middle: 30, valid: true }],
      },
      {
        label: "two rules where one number in update does not exist in a rule",
        rules: [
          { left: 10, right: 20 },
          { left: 10, right: 50 },
        ],
        updates: [[10, 20, 30, 40, 0]],
        expectedResults: [{ original: [10, 20, 30, 40, 0], middle: 30, valid: true }],
      },
    ];
    it.each(testCases)("validates simple rules where all allowed - %o", (testCase) => {
      expect(validateUpdates(testCase.updates, testCase.rules)).toEqual(testCase.expectedResults);
    });

    it("validates basic updates against riles (basic input file)", () => {
      const { rules, updates } = parseFile(basic_rules);

      const results = validateUpdates(updates, rules);

      expect(results).toEqual([
        { original: [75, 47, 61, 53, 29], middle: 61, valid: true },
        { original: [97, 61, 53, 29, 13], middle: 53, valid: true },
        { original: [75, 29, 13], middle: 29, valid: true },
        { original: [75, 97, 47, 61, 53], middle: 47, valid: false },
        { original: [61, 13, 29], middle: 13, valid: false },
        { original: [97, 13, 75, 29, 47], middle: 75, valid: false },
      ]);
      expect(sumValid(results)).toEqual(143);
    });

    it("validates large input file", () => {
      const { rules, updates } = parseFile(input);

      const results = validateUpdates(updates, rules);

      expect(sumValid(results)).toEqual(5964);
    });
  });
});

describe.only("part two", () => {
  describe("reorder", () => {
    it("reorders a single simple bad updates correctly (simple rules)", () => {
      const result = reorder([1, 2], [{ left: 2, right: 1 }]);

      expect(result).toEqual([2, 1]);
    });
    it("reorders a single 5 size updates correctly (simple rules)", () => {
      const result = reorder([1, 2, 3, 4], [{ left: 2, right: 1 }]);

      expect(result).toEqual([2, 1, 3, 4]);
    });
    it("reorders a single 5 size updates correctly (simple rules)", () => {
      const result = reorder(
        [1, 2, 3, 4],
        [
          { left: 2, right: 1 }, // [2, 1, 3, 4]
          { left: 4, right: 1 }, // [2, 4, 3, 1]
          { left: 2, right: 3 }, // [2, 4, 3, 1]
          { left: 3, right: 4 }, // [2, 3, 4, 1]
        ]
      );

      expect(result).toEqual([2, 3, 4, 1]);
    });

    it.only("reorders 97,13,75,29,47", () => {
      const result = reorder(
        [97, 13, 75, 29, 47],
        [
          { left: 47, right: 53 },
          { left: 97, right: 13 },
          { left: 97, right: 61 },
          { left: 97, right: 47 },
          { left: 75, right: 29 },
          { left: 61, right: 13 },
          { left: 75, right: 53 },
          { left: 29, right: 13 },
          { left: 97, right: 29 },
          { left: 53, right: 29 },
          { left: 61, right: 53 },
          { left: 97, right: 53 },
          { left: 61, right: 29 },
          { left: 47, right: 13 },
          { left: 75, right: 47 },
          { left: 97, right: 75 },
          { left: 47, right: 61 },
          { left: 75, right: 61 },
          { left: 47, right: 29 },
          { left: 75, right: 13 },
          { left: 53, right: 13 },
        ]
      );

      expect(result).toEqual([97, 75, 47, 29, 13]); // 97,75,47,29,13
    });
  });

  describe("calculate", () => {
    it("calculates the basic file correctly", () => {
      const { rules, updates } = parseFile(basic_rules);
      const results = validateUpdates(updates, rules);
      const invalid = results.filter((x) => x.valid === false);
      const sorted = invalid.map((x) => {
        const reordered = reorder(x.original, rules);
        const middle = [...reordered][Math.floor(reordered.length / 2)];
        return { reordered, middle };
      });

      expect(invalid.length).toEqual(3);
      expect(invalid).toEqual([
        { middle: 47, original: [75, 97, 47, 61, 53], valid: false },
        { middle: 13, original: [61, 13, 29], valid: false },
        { middle: 75, original: [97, 13, 75, 29, 47], valid: false },
      ]);
      expect(sorted).toEqual([
        { middle: 47, reordered: [97, 75, 47, 61, 53] },
        { middle: 29, reordered: [61, 29, 13] },
        { middle: 47, reordered: [97, 75, 47, 29, 13] },
      ]);
      expect(sorted.reduce((acc, curr) => acc + curr.middle, 0)).toEqual(123);
    });
  });

  it("calculates the input file correctly", () => {
    const { rules, updates } = parseFile(input);
    const results = validateUpdates(updates, rules);
    const invalid = results.filter((x) => x.valid === false);
    const sorted = invalid.map((x) => {
      const reordered = reorder(x.original, rules);
      const middle = [...reordered][Math.floor(reordered.length / 2)];
      return { reordered, middle };
    });

    expect(sorted.reduce((acc, curr) => acc + curr.middle, 0)).toEqual(4719);
  });
});

function sumValid(input: ValidateResultItem[]): number {
  return input.filter((x) => x.valid === true).reduce((acc, curr) => acc + curr.middle, 0);
}

function reorder(update: Update, rules: Rule[]): Update {
  let copy = [...update];
  let changed = true;
  while (changed) {
    changed = false;
    for (const rule of rules) {
      const leftRuleIndex = copy.indexOf(rule.left);
      const rightRuleIndex = copy.indexOf(rule.right);
      const ruleApplies = leftRuleIndex >= 0 && rightRuleIndex >= 0;
      if (ruleApplies) {
        const ruleBroken = leftRuleIndex > rightRuleIndex;
        if (ruleBroken) {
          const temp = copy[leftRuleIndex];
          copy[leftRuleIndex] = copy[rightRuleIndex];
          copy[rightRuleIndex] = temp;
          changed = true;
        }
      }
    }
  }
  return copy;
}

function validateUpdates(updates: Update[], rules: Rule[]): ValidateResultItem[] {
  const results: ValidateResultItem[] = [];
  let valid = true;
  for (const update of updates) {
    let valid = true;
    let ruleNum = 0;
    while (valid === true && ruleNum < rules.length) {
      const currentRule = rules[ruleNum];
      const indexOfLeft = update.indexOf(currentRule.left);
      const indexOfRight = update.indexOf(currentRule.right);
      const shouldCheckRule = indexOfLeft >= 0 && indexOfRight >= 0;
      if (shouldCheckRule) {
        valid = indexOfLeft < indexOfRight;
      }
      ruleNum = ruleNum + 1;
    }
    results.push({ original: update, middle: update[Math.floor(update.length / 2)], valid });
  }
  return results;
}

type ValidateResultItem = { original: Update; middle: number; valid: boolean };

function parseFile(input: string): { rules: Rule[]; updates: Update[] } {
  let lines = input.trim().split("\n");
  let rules = lines
    .filter((x) => x.match(/\|/g))
    .map((x) => {
      let result = x.match(/(\d+)\|(\d+)/);
      if (!result) {
        throw new Error("could not parse " + result);
      }
      return { left: parseInt(result[1]), right: parseInt(result[2]) };
    });
  let updates = lines
    .filter((x) => x.includes(","))
    .map((x) => x.split(","))
    .map((x) => x.map((y) => parseInt(y)));
  return { rules, updates };
}

type Rule = {
  left: number;
  right: number;
};

type Update = number[];
