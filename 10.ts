import { Option, isNone, isSome, none, some } from "jsr:@baetheus/fun/option";

import { loadFromFile } from "./lib.ts";
import { Grid, Coord, getAdjacentCoords } from "./lib/Coord.ts";

async function main() {
  const lines = await loadFromFile("./10-input.txt");
  const grid = parseGrid(lines);
  console.log(`Part 1: ${partOne(grid)}`);
  console.log(`Part 2: ${partTwo(grid)}`);
}

function partOne(grid: Grid<Tile>): number {
  return trailheadCoords(grid).reduce((acc, coord) => {
    const alreadyScored: Coord[] = [];
    return acc + scoreTrail(grid, coord, alreadyScored);
  }, 0);
}

function partTwo(grid: Grid<Tile>): number {
  return trailheadCoords(grid).reduce((acc, coord) => {
    return acc + scoreTrail(grid, coord, [], true);
  }, 0);
}

function trailheadCoords(grid: Grid<Tile>): Coord[] {
  const test = grid.reduce((acc, row, y) =>
    acc.concat(...row.map((col, x) =>
      isSome(col) && col.value === 0 ? [{ x, y }] : []
    )
  ), [] as Coord[]);
  return test;
}

function scoreTrail(
  grid: Grid<Tile>,
  trail: Coord,
  alreadyScoredCoords: Coord[],
  countAlreadyScored: boolean = false
): number {
  const height = grid[trail.y][trail.x];
  if (isNone(height)) return 0;

  const alreadyScored = alreadyScoredCoords.filter((coord) =>
    coord.x === trail.x && coord.y === trail.y
  ).length > 0;

  if (height.value === 9 && (!alreadyScored || countAlreadyScored)) {
    alreadyScoredCoords.push(trail);
    return 1;
  }

  const validAdjCoords = getAdjacentCoords(grid, trail).filter((coord) => {
    const adjHeight = grid[coord.y][coord.x];
    return isSome(adjHeight) && adjHeight.value === height.value + 1;
  });
  if (validAdjCoords.length === 0) return 0;

  return validAdjCoords.reduce((acc, coord) =>
    acc + scoreTrail(grid, coord, alreadyScoredCoords, countAlreadyScored)
  , 0);
}

function parseGrid(lines: string[]): Grid<Tile> {
  return lines.map((line) => line.split("").map((c) => c === "." ? none : some(parseInt(c, 10))));
}

type Tile = Option<number>;

main();
