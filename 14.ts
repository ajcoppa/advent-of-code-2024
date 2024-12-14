import { time } from "node:console";
import { deepCopy, loadFromFile, product, range, sum } from "./lib.ts";
import { Coord, Grid } from "./lib/Coord.ts";

async function main() {
  const lines = await loadFromFile("./14-input.txt");
  const robots = parseRobots(lines);
  const partTwoRobots = deepCopy(robots);
  console.log(`Part 1: ${partOne(robots)}`);
  console.log(`Part 2: ${partTwo(partTwoRobots)}`);
}

function partOne(robots: Robot[]): number {
  const gridX = 101;
  const gridY = 103;
  const grid: Grid<number> = range(0, gridY).map((y) =>
    range(0, gridX).map((x) => 0)
  );
  robots.forEach((robot) => {
    const { x, y } = robot.position;
    grid[y][x] += 1;
  });

  moveRobots(robots, grid, 100);
  return product(robotsPerQuadrant(grid));
}

function partTwo(robots: Robot[]): number {
  const gridX = 101;
  const gridY = 103;
  const grid: Grid<number> = range(0, gridY).map((_y) =>
    range(0, gridX).map((_x) => 0)
  );
  robots.forEach((robot) => {
    const { x, y } = robot.position;
    grid[y][x] += 1;
  });

  let longRunOfOnes = false, turns = 0;
  while (!longRunOfOnes) {
    turns++;
    moveRobots(robots, grid, 1);
    longRunOfOnes = grid.some((row) => row.join("").includes("1111111111111"));
  }
  printGrid(grid);
  return turns;
}

function moveRobots(robots: Robot[], grid: Grid<number>, turns: number): void {
  const gridX = grid[0].length;
  const gridY = grid.length;
  for (const robot of robots) {
    const { x, y } = robot.position;
    const vx = robot.velocity.x;
    const vy = robot.velocity.y;
    let newX = (x + vx * turns) % gridX;
    newX = newX < 0 ? gridX + newX : newX;
    let newY = (y + vy * turns) % gridY;
    newY = newY < 0 ? gridY + newY : newY;
    grid[y][x] -= 1;
    grid[newY][newX] += 1;
    robot.position = { x: newX, y: newY };
  }
}

function robotsPerQuadrant(grid: Grid<number>): number[] {
  const gridX = grid[0].length;
  const gridY = grid.length;
  const midX = Math.floor(gridX / 2);
  const midY = Math.floor(gridY / 2);
  const quadrants = [
    [0, 0, midX, midY],
    [midX + 1, 0, gridX, midY],
    [0, midY + 1, midX, gridY],
    [midX + 1, midY + 1, gridX, gridY],
  ];
  return quadrants.map(([x1, y1, x2, y2]) =>
    sum(grid.slice(y1, y2).map((row) => sum(row.slice(x1, x2))))
  );
}

function printGrid(grid: Grid<number>): void {
  console.log(grid.map((row) => row.join("")).join("\n"));
}

function parseRobots(lines: string[]): Robot[] {
  return lines.map((line) => {
    const match = line.match(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/);
    if (!match) throw new Error(`Invalid line: ${line}`);
    const [_, px, py, vx, vy] = match;
    return {
      position: { x: parseInt(px, 10), y: parseInt(py, 10) },
      velocity: { x: parseInt(vx, 10), y: parseInt(vy, 10) },
    };
  });
}

type Robot = {
  position: Coord;
  velocity: Coord;
}

main();
