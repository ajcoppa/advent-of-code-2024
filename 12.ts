import { loadFromFile } from "./lib.ts";
import { Grid, contiguousRegions, getRegionPerimeter } from "./lib/Coord.ts";

async function main() {
  const lines = await loadFromFile("./12-input.txt");
  const grid = parseGrid(lines);
  console.log(`Part 1: ${partOne(grid)}`);
}

function partOne(grid: Grid<string>) {
  const regionsMap = contiguousRegions(grid);
  let totalPrice = 0;
  regionsMap.forEach((regions, _item) => {
    regions.forEach((region) => {
      totalPrice += region.length * getRegionPerimeter(grid, region);
    });
  });
  return totalPrice;
}

function parseGrid(lines: string[]): Grid<string> {
  return lines.map((line) => line.split(""));
}

main();
