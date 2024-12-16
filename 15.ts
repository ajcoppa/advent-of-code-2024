import fs from "node:fs/promises";
import { sum } from "./lib.ts";
import {
  Direction,
  Grid,
  applyDirectionToCoord,
  directionToModifier,
  inBounds,
} from "./lib/Coord.ts";

async function main() {
  const text = await fs.readFile("./15-input.txt", { encoding: "utf-8" });
  const [gridStr, directionsStr] = text.split("\n\n");
  const grid = parseGrid(gridStr.split("\n"));
  const directions = parseDirections(directionsStr);
  console.log(`Part 1: ${partOne(grid, directions)}`);
}

function partOne(grid: Grid<Tile>, directions: Direction[]): number {
  directions.forEach((direction) => {
    move(grid, direction);
  });
  return calculateGps(grid);
}

function move(grid: Grid<Tile>, direction: Direction): void {
  const robotY = grid.findIndex((row) => row.some((col) => col._type === "Robot"));
  const robotX = grid[robotY].findIndex((col) => col._type === "Robot");
  const robotCoord = { x: robotX, y: robotY };

  const newCoord = applyDirectionToCoord(robotCoord, direction);
  const newTile = grid[newCoord.y][newCoord.x];

  if (newTile._type === "Wall") {
    return;
  } else if (newTile._type === "Empty") {
    grid[robotCoord.y][robotCoord.x] = { _type: "Empty" };
    grid[newCoord.y][newCoord.x] = { _type: "Robot" };
  } else if (newTile._type === "Box") {
    // If a box is next to the robot, scan down the line until we reach either
    // an empty tile or a wall. If we reach a wall, the boxes can't move. If
    // we reach an empty tile, swap it for a box and move the robot.
    let nextCoord = {
      x: newCoord.x + directionToModifier(direction).x,
      y: newCoord.y + directionToModifier(direction).y
    };
    while (inBounds(nextCoord.x, nextCoord.y, grid[0].length, grid.length)
      && grid[nextCoord.y][nextCoord.x]._type !== "Empty"
      && grid[nextCoord.y][nextCoord.x]._type !== "Wall"
    ) {
      nextCoord = {
        x: nextCoord.x + directionToModifier(direction).x,
        y: nextCoord.y + directionToModifier(direction).y
      };
    }
    if (grid[nextCoord.y][nextCoord.x]._type === "Wall") {
      return;
    }

    const emptyCoord = nextCoord;
    grid[emptyCoord.y][emptyCoord.x] = { _type: "Box" };
    grid[robotCoord.y][robotCoord.x] = { _type: "Empty" };
    grid[newCoord.y][newCoord.x] = { _type: "Robot" };
  }
}

function calculateGps(grid: Grid<Tile>): number {
  return sum(grid.map((row, y) =>
    sum(row.map((tile, x) => tile._type === "Box" ? y * 100 + x: 0))
  ));
}

function parseGrid(lines: string[]): Tile[][] {
  return lines.map((line) => line.split("").map(parseTile));
}

function parseDirections(text: string): Direction[] {
  return text.split("").filter((c) => c !== "\n").map(parseDirection);
}

function parseTile(c: string): Tile {
  return (c === ".") ? { _type: "Empty" } : 
         (c === "#") ? { _type: "Wall" }  :
         (c === "O") ? { _type: "Box" } :
         { _type: "Robot" };  // @
}

function parseDirection(c: string): Direction {
  return (c === "v") ? Direction.Down :
         (c === "^") ? Direction.Up :
         (c === "<") ? Direction.Left :
         (c === ">") ? Direction.Right :
         Direction.Down;
}

function printGrid(grid: Grid<Tile>) {
  grid.forEach((row) => {
    console.log(row.map(tileToString).join(""));
  });
}

function printDirections(directions: Direction[]) {
  console.log(directions.map(directionToString).join(""));
}

function directionToString(direction: Direction): string {
  return direction === Direction.Down ? "v" :
         direction === Direction.Up ? "^" :
         direction === Direction.Left ? "<" :
         direction === Direction.Right ? ">" :
         "?";
}

function tileToString(tile: Tile): string {
  return tile._type === "Empty" ? "." :
         tile._type === "Wall" ? "#" :
         tile._type === "Box" ? "O" :
         "@";
}

type Tile =
  | { _type: "Empty" }
  | { _type: "Box" }
  | { _type: "Robot"}
  | { _type: "Wall"};


main();
