import { loadFromFile } from "./lib.ts";
import { getGridLines, Grid } from "./lib/Coord.ts";

async function main() {
  const lines = await loadFromFile("./04-input.txt");
  const grid: Grid<string> = lines.map((line) => line.split(""));
  console.log(`Part 1: ${partOne(grid)}`);
  console.log(`Part 2: ${partTwo(grid)}`);
}

function partOne(grid: Grid<string>): number {
  let xmases: number = 0;
  for (let x = 0; x < grid[0].length; x++) {
    for (let y = 0; y < grid.length; y++) {
      if (grid[y][x] !== "X") continue;
      const outwardLines = getGridLines(grid, { x, y }, true, (_grid, _coord, line) => line.length < 4);
      xmases += outwardLines.map((line) =>
        line.join("").startsWith("XMAS") ? 1 : 0
      ).reduce((a: number, b: number) => a + b, 0);
    }
  }
  return xmases;
}

function partTwo(grid: Grid<string>): number {
  let xmases: number = 0;
  for (let x = 1; x < grid[0].length - 1; x++) {
    for (let y = 1; y < grid.length - 1; y++) {
      if (grid[y][x] !== "A") continue;
      const diagonals = [
        [grid[y-1][x-1], grid[y][x], grid[y+1][x+1]],
        [grid[y-1][x+1], grid[y][x], grid[y+1][x-1]]
      ];
      const firstDiag = diagonals[0].join("");
      const secondDiag = diagonals[1].join("");
      xmases += (firstDiag === "SAM" || firstDiag === "MAS") &&
                (secondDiag === "SAM" || secondDiag === "MAS") ? 1 : 0;
    }
  }
  return xmases;
}

main();
