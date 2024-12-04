import { loadFromFile, sum } from "./lib.ts";
import { getGridLines, Grid } from "./lib/Coord.ts";

async function main() {
  const lines = await loadFromFile("./04-input.txt");
  const grid: Grid<string> = lines.map((line) => line.split(""));
  console.log(`Part 1: ${partOne(grid)}`);
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

main();
