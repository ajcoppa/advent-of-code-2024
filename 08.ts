import { combinations, loadFromFile } from "./lib.ts";
import { Coord, Grid, inBounds } from "./lib/Coord.ts";

async function main() {
  const lines = await loadFromFile("./08-input.txt");
  const {grid, antennas} = parseGrid(lines);
  console.log(`Part 1: ${partOne(grid, antennas)}`);
}

function partOne(grid: Grid<Tile>, antennas: Record<string, Coord[]>): number {
  let antinodeCount = 0;
  for (const [_id, coords] of Object.entries(antennas)) {
    const coordPairs = combinations(coords, 2);
    antinodeCount += markAntinodes(grid, coordPairs);
  }
  return antinodeCount;
}

function markAntinodes(grid: Grid<Tile>, coordPairs: Coord[][]): number {
  let antinodeCount = 0;
  for (const [coord1, coord2] of coordPairs) {
    const xDist = coord1.x - coord2.x;
    const yDist = coord1.y - coord2.y;
    [
      { x: coord1.x + xDist, y: coord1.y + yDist },
      { x: coord2.x - xDist, y: coord2.y - yDist },
    ].forEach((coord) => {
      if (!inBounds(coord.x, coord.y, grid[0].length, grid.length)) return;

      if (grid[coord.y][coord.x]._type === "Empty") {
        grid[coord.y][coord.x] = { _type: "Antinode" };
        antinodeCount++;
      } else if (
        grid[coord.y][coord.x]._type === "Antenna" &&
        !grid[coord.y][coord.x].antinode
      ) {
        grid[coord.y][coord.x].antinode = true;
        antinodeCount++;
      }
    });
  }
  return antinodeCount;
}

function parseGrid(lines: string[]): {
  grid: Grid<Tile>,
  antennas: Record<string, Coord[]>
} {
  const antennas: Record<string, Coord[]> = {};
  const grid: Grid<Tile> = lines.map((line, y) => line.split("").map((c, x) => {
    const tile = parseTile(c);
    if (tile._type === "Antenna") {
      antennas[tile.id] = antennas[tile.id] ?? [];
      antennas[tile.id].push({ x, y });
    }
    return tile;
  }));

  return {
    grid,
    antennas,
  };
}

function parseTile(c: string): Tile {
  return (c === ".") ? { _type: "Empty" } : { _type: "Antenna", id: c, antinode: false };
}

type Tile =
  | { _type: "Empty" }
  | { _type: "Antenna", id: string, antinode: boolean }
  | { _type: "Antinode"};

main();
