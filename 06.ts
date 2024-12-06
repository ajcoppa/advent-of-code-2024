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
  const grid = parseGrid(lines);
  console.log(`Part 1: ${partOne(grid)}`);
}

function partOne(grid: Grid<Tile>): number {
  const visited: Grid<boolean> = grid.map((row) => row.map((col) =>
    col._type === "Guard" ? true : false
  ));
  while (tick(grid, visited)) {
    // No-op
  }
  return sum(visited.map((row) => row.filter((col) => col).length));
}

function tick(grid: Grid<Tile>, visited: Grid<boolean>): boolean {
  const guardY: number = grid.findIndex((row) => row.some((col) => col._type === "Guard"));
  const guardX: number = grid[guardY].findIndex((col) => col._type === "Guard");
  visited[guardY][guardX] = true;
  const facing = grid[guardY][guardX]._type === "Guard" ?
    grid[guardY][guardX].direction :
    Direction.Up;
  const modifier = directionToModifier(facing);
  const newGuardCoord: Coord = {
    x: guardX + modifier.x,
    y: guardY + modifier.y,
  };

  if (!inBounds(newGuardCoord.x, newGuardCoord.y, grid[0].length, grid.length)) {
    return false;
  }

  if (grid[newGuardCoord.y][newGuardCoord.x]._type === "Empty") {
    grid[guardY][guardX] = { _type: "Empty" };
    grid[newGuardCoord.y][newGuardCoord.x] = { _type: "Guard", direction: facing };
    return true;
  } else if (grid[newGuardCoord.y][newGuardCoord.x]._type === "Wall") {
    grid[guardY][guardX] = { _type: "Guard", direction: rotateClockwise(facing) };
    return true;
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

function parseGrid(lines: string[]): Grid<Tile> {
  return lines.map(line => line.split("").map(charToTile));
}

type Tile =
  | { _type: "Empty" }
  | { _type: "Wall" }
  | { _type: "Guard", direction: Direction };

main();
