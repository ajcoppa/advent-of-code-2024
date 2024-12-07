import { loadFromFile, sum } from "./lib.ts";
import {
  Coord,
  Direction,
  Grid,
  directionToModifier,
  inBounds,
  rotateClockwise,
} from "./lib/Coord.ts";

async function main() {
  const lines = await loadFromFile("./06-input.txt");
  console.log(`Part 1: ${partOne(parseGrid(lines))}`);
  console.log(`Part 2: ${partTwo(parseGrid(lines))}`);
}

function partOne(grid: Grid<Tile>): number {
  const visited: Grid<Visited> = grid.map((row) => row.map((col) =>
    col._type === "Guard" ?
      { _type: "Visited", going: [col.direction] } :
      { _type: "NeverVisited" }
  ));
  while (tick(grid, visited) !== SimulationResult.GuardLeftGrid) {
    // No-op
  }
  return sum(visited.map((row) => row.filter((col) => col._type === "Visited").length));
}

function partTwo(grid: Grid<Tile>): number {
  const originalGrid = deepCopy(grid);
  let visited: Grid<Visited> = grid.map((row) => row.map((col) =>
    col._type === "Guard" ?
      { _type: "Visited", going: [col.direction] } :
      { _type: "NeverVisited" }
  ));

  const loopCoords = grid.map((row, y) => {
    return row.map((_col, x) => {
      if (grid[y][x]._type === "Guard") {
        return false;
      }

      grid[y][x] = { _type: "Wall" };
      let result: SimulationResult;
      while ((result = tick(grid, visited)) === SimulationResult.KeepGoing) {
        // No-op
      }

      // Reset the grid
      grid = deepCopy(originalGrid);
      visited = grid.map((row) => row.map((col) =>
        col._type === "Guard" ?
          { _type: "Visited", going: [col.direction] } :
          { _type: "NeverVisited" }
      ));
      if (result === SimulationResult.LoopDetected) {
        return true;
      }
      return false;
    });
  });

  return loopCoords.flat().filter((col) => col).length;
}

function tick(grid: Grid<Tile>, visited: Grid<Visited>): SimulationResult {
  const guardY: number = grid.findIndex((row) => row.some((col) => col._type === "Guard"));
  const guardX: number = grid[guardY].findIndex((col) => col._type === "Guard");
  
  const facing = grid[guardY][guardX]._type === "Guard" ?
    grid[guardY][guardX].direction :
    Direction.Up;
  const modifier = directionToModifier(facing);
  const newGuardCoord: Coord = {
    x: guardX + modifier.x,
    y: guardY + modifier.y,
  };

  visited[guardY][guardX] = {
    _type: "Visited",
    going: visited[guardY][guardX]._type === "Visited" ?
      [...visited[guardY][guardX].going, facing] :
      [facing],
  };

  if (!inBounds(newGuardCoord.x, newGuardCoord.y, grid[0].length, grid.length)) {
    return SimulationResult.GuardLeftGrid;
  }

  if (visited[newGuardCoord.y][newGuardCoord.x]._type === "Visited" &&
    visited[newGuardCoord.y][newGuardCoord.x].going.includes(facing)) {
    grid[guardY][guardX] = { _type: "Empty" };
    grid[newGuardCoord.y][newGuardCoord.x] = {
      _type: "Guard",
      direction: facing,
    };
    return SimulationResult.LoopDetected;
  } else if (grid[newGuardCoord.y][newGuardCoord.x]._type === "Empty") {
    grid[guardY][guardX] = { _type: "Empty" };
    grid[newGuardCoord.y][newGuardCoord.x] = { _type: "Guard", direction: facing };
    return SimulationResult.KeepGoing;
  } else if (grid[newGuardCoord.y][newGuardCoord.x]._type === "Wall") {
    grid[guardY][guardX] = { _type: "Guard", direction: rotateClockwise(facing) };
    return SimulationResult.KeepGoing;
  }

  console.log(grid);
  console.log(visited);
  throw new Error("Unhandled grid / move state");
}

function charToTile(c: string): Tile {
  if (c === "#") return { _type: "Wall" };
  else if (c === ".") return { _type: "Empty" };
  else if (c === "^") return { _type: "Guard", direction: Direction.Up };
  else {
    throw new Error(`Unknown tile: ${c}`);
  }
}

function deepCopy<T>(xs: T[]): T[] {
  return JSON.parse(JSON.stringify(xs));
}

function parseGrid(lines: string[]): Grid<Tile> {
  return lines.map(line => line.split("").map(charToTile));
}

enum SimulationResult {
  KeepGoing,
  GuardLeftGrid,
  LoopDetected,
}

type Visited =
  | { _type: "NeverVisited" }
  | { _type: "Visited", going: Direction[] };

type Tile =
  | { _type: "Empty" }
  | { _type: "Wall" }
  | { _type: "Guard", direction: Direction };

main();
