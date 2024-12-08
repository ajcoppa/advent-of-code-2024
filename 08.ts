import { combinations, loadFromFile, deepCopy } from "./lib.ts";
import { Coord, Grid, inBounds } from "./lib/Coord.ts";

async function main() {
  const lines = await loadFromFile("./08-input.txt");
  const {grid, antennas} = parseGrid(lines);
  const grid2 = deepCopy(grid);

  console.log(`Part 1: ${partOne(grid, antennas)}`);
  console.log(`Part 2: ${partTwo(grid2, antennas)}`);
}

function partOne(grid: Grid<Tile>, antennas: Record<string, Coord[]>): number {
  let antinodeCount = 0;
  for (const [_id, coords] of Object.entries(antennas)) {
    const coordPairs = combinations(coords, 2);
    antinodeCount += markAntinodes(grid, coordPairs);
  }
  return antinodeCount;
}

function partTwo(grid: Grid<Tile>, antennas: Record<string, Coord[]>): number {
  let antinodeCount = 0;
  antinodeCount += markAntennaAntinodes(grid, antennas);
  for (const [_id, coords] of Object.entries(antennas)) {
    const coordPairs = combinations(coords, 2);
    antinodeCount += markAntinodes(grid, coordPairs, true);
  }
  return antinodeCount;
}

function markAntennaAntinodes(grid: Grid<Tile>, antennas: Record<string, Coord[]>) {
  let antinodeCount = 0;
  for (const [_id, coords] of Object.entries(antennas)) {
    for (const coord of coords) {
      grid[coord.y][coord.x]._type === "Antenna" && grid[coord.y][coord.x].antinodes++;
      antinodeCount++;
    }
  }
  return antinodeCount;
}

function markAntinodes(
  grid: Grid<Tile>,
  coordPairs: Coord[][],
  resonant: boolean = false
): number {
  let antinodeCount = 0;
  for (const [coord1, coord2] of coordPairs) {
    const xDist = coord1.x - coord2.x;
    const yDist = coord1.y - coord2.y;
    [
      { starting: { x: coord1.x, y: coord1.y }, op: (a: number, b: number) => a + b },
      { starting: { x: coord2.x, y: coord2.y }, op: (a: number, b: number) => a - b },
    ].forEach(({ starting, op }) => {
      let x = op(starting.x, xDist);
      let y = op(starting.y, yDist);
      do {
        if (!inBounds(x, y, grid[0].length, grid.length))
          break;

        if (grid[y][x]._type === "Empty") {
          grid[y][x] = { _type: "Antinode" };
          antinodeCount++;
        } else if (grid[y][x]._type === "Antenna" &&
          !resonant &&
          grid[y][x].antinodes === 0
        ) {
          grid[y][x].antinodes++;
          antinodeCount++;
        }

        x = op(x, xDist);
        y = op(y, yDist);
      } while (resonant && inBounds(x, y, grid[0].length, grid.length));
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
  return (c === ".") ? { _type: "Empty" } : { _type: "Antenna", id: c, antinodes: 0 };
}

type Tile =
  | { _type: "Empty" }
  | { _type: "Antenna", id: string, antinodes: number }
  | { _type: "Antinode"};

main();
