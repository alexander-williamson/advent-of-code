import fs from "fs-extra";

const basic_input = fs.readFileSync("2024/06/basic_input.txt").toString();
const complex_input = fs.readFileSync("2024/06/complex_input.txt").toString();

describe("part one", () => {
  describe("parse", () => {
    it("fetches the items correctly", () => {
      const result = parse(basic_input);

      expect(result.width).toEqual(10);
      expect(result.height).toEqual(10);
    });
  });

  describe("finished", () => {
    it("returns true if along top edge and facing north", () => {
      const grid = parse(basic_input.replace(/^/g, "."));

      expect(finished(grid.lines, { direction: "^", x: 0, y: 0 })).toEqual(true);
      expect(finished(grid.lines, { direction: "^", x: 9, y: 0 })).toEqual(true);
      expect(finished(grid.lines, { direction: "^", x: 1, y: 1 })).toEqual(false);
    });
    it("returns true if along left edge and facing west", () => {
      const grid = parse(basic_input.replace(/^/g, "."));

      expect(finished(grid.lines, { direction: "<", x: 0, y: 0 })).toEqual(true);
      expect(finished(grid.lines, { direction: "<", x: 0, y: 9 })).toEqual(true);
      expect(finished(grid.lines, { direction: "<", x: 1, y: 1 })).toEqual(false);
    });
    it("returns true if along bottom edge and facing down", () => {
      const grid = parse(basic_input.replace(/^/g, "."));

      expect(finished(grid.lines, { direction: "v", x: 0, y: 9 })).toEqual(true);
      expect(finished(grid.lines, { direction: "v", x: 9, y: 9 })).toEqual(true);
      expect(finished(grid.lines, { direction: "v", x: 1, y: 1 })).toEqual(false);
    });
    it("returns true if along right edge and facing east", () => {
      const grid = parse(basic_input.replace(/\^/g, "."));

      expect(finished(grid.lines, { direction: ">", x: 9, y: 0 })).toEqual(true);
      expect(finished(grid.lines, { direction: ">", x: 9, y: 9 })).toEqual(true);
      expect(finished(grid.lines, { direction: ">", x: 1, y: 1 })).toEqual(false);
    });
  });

  describe("getPlayerPosition", () => {
    expect(getPlayerPosition(parse(basic_input).lines)).toEqual({
      direction: "^",
      x: 4,
      y: 6,
    });
    expect(getPlayerPosition(parse(basic_input.replace(/\^/g, ">")).lines)).toEqual({
      direction: ">",
      x: 4,
      y: 6,
    });
    expect(getPlayerPosition(parse(basic_input.replace(/\^/g, "v")).lines)).toEqual({
      direction: "v",
      x: 4,
      y: 6,
    });
    expect(getPlayerPosition(parse(basic_input.replace(/\^/g, "<")).lines)).toEqual({
      direction: "<",
      x: 4,
      y: 6,
    });
  });

  describe("walk", () => {
    it("walks a simple grid", () => {
      const grid = parse(basic_input);

      const result = walk(grid);

      expect(result.locations.length).toEqual(41);
      expect(result.isLooping).toEqual(false);
    });

    it("walks a complex grid", () => {
      const grid = parse(complex_input);

      const result = walk(grid);

      expect(result.locations.length).toEqual(5444);
      expect(result.isLooping).toEqual(false);
    });
  });
});

describe("part two", () => {
  it("finds correct number of loops for basic_input", () => {
    const grid = parse(basic_input);

    const result = countSuccessfulObstructions(grid);

    expect(result).toEqual(6);
  });
  it.only("finds correct number of loops for complex_input", () => {
    const grid = parse(complex_input);

    const result = countSuccessfulObstructions(grid);

    expect(result).toEqual(6);
  });
});

function countSuccessfulObstructions(grid: Grid): number {
  const possibleObstructionCoordinates: Coordinates[] = [];
  for (let y = 0; y < grid.lines.length; y++) {
    for (let x = 0; x < grid.lines[0].length; x++) {
      if (grid.lines[y][x] === ".") {
        possibleObstructionCoordinates.push({ x, y });
      }
    }
  }
  const loops: Coordinates[] = [];
  for (const obstruction of possibleObstructionCoordinates) {
    const result = walk(grid, obstruction);
    if (result.isLooping) {
      loops.push(obstruction);
    }
    console.debug(obstruction);
  }
  return loops.length;
}

type Coordinates = { x: number; y: number };

function walk(grid: Grid, obstruction?: Coordinates): { locations: Coordinates[]; isLooping: boolean } {
  let isEdgeOfGrid = false;
  let isLooping = false;
  let lines: string[][] = JSON.parse(JSON.stringify(grid.lines));
  if (obstruction) {
    lines[obstruction.y][obstruction.x] = "O";
  }
  let locations: { x: number; y: number; direction: Direction }[] = [];
  let { x, y, direction } = getPlayerPosition(lines);
  while (!isEdgeOfGrid && !isLooping) {
    let nextPos: { x: number; y: number };
    if (direction === "^") {
      nextPos = { x, y: y - 1 };
    } else if (direction === ">") {
      nextPos = { x: x + 1, y };
    } else if (direction === "v") {
      nextPos = { x, y: y + 1 };
    } else {
      nextPos = { x: x - 1, y };
    }

    // todo
    // if there is an obstruction, check if we're in a loop
    // if we've seen two numbers in succession we're looping
    if (obstruction && locations.length > 4) {
      let hasBeenHereBefore = locations.find((loc) => loc.x === x && y === loc.y && direction === loc.direction);
      if (hasBeenHereBefore) {
        isLooping = true;
        break;
      }
    }

    if (lines[nextPos.y][nextPos.x] === "#" || lines[nextPos.y][nextPos.x] === "O") {
      if (direction === "^") {
        direction = ">";
      } else if (direction === ">") {
        direction = "v";
      } else if (direction === "v") {
        direction = "<";
      } else {
        direction = "^";
      }
    } else {
      locations.push({ x, y, direction });
      lines[y][x] = "X";
      lines[nextPos.y][nextPos.x] = direction;
      x = nextPos.x;
      y = nextPos.y;
    }

    isEdgeOfGrid = finished(lines, { x, y, direction });
  }
  // final move
  locations.push({ x, y, direction });
  lines[y][x] = "X";
  return { locations: deduplicate(locations), isLooping: isLooping };
}

function deduplicate(input: { x: number; y: number }[]): { x: number; y: number }[] {
  return Array.from(new Set(input.map((loc) => JSON.stringify(loc)))).map((str) => JSON.parse(str));
}

function getPlayerPosition(lines: string[][]): PlayerPosition {
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[0].length; x++) {
      const item = lines[y][x];
      if (item.match(/\^|\>|\<|v/g)) return { direction: item as Direction, x, y };
    }
  }
  throw new Error("could not find player");
}

type Direction = "^" | ">" | "v" | "<";

function finished(lines: string[][], currentPlayerPosition: PlayerPosition): boolean {
  if (currentPlayerPosition.x === 0 && currentPlayerPosition.direction === "<") {
    return true;
  }
  if (currentPlayerPosition.x === lines[0].length - 1 && currentPlayerPosition.direction === ">") {
    return true;
  }
  if (currentPlayerPosition.y === 0 && currentPlayerPosition.direction === "^") {
    return true;
  }
  if (currentPlayerPosition.y === lines.length - 1 && currentPlayerPosition.direction === "v") {
    return true;
  }
  return false;
}

type PlayerPosition = { x: number; y: number; direction: "^" | ">" | "<" | "v" };
type Grid = { width: number; height: number; lines: string[][] };

function parse(input: string): Grid {
  const lines = input
    .trim()
    .split("\n")
    .map((x) => x.trim().split(""));

  return { width: lines[0].length, height: lines.length, lines };
}
