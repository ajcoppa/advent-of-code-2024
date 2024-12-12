import { any } from "../lib.ts";

export type Coord = {
  x: number;
  y: number;
};

export type Grid<A> = A[][];

export enum Direction {
  Up,
  Down,
  Left,
  Right,
}

export function allDirections(includeDiagonals: boolean = false): Coord[] {
  const modifications = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: -1, y: 0 },
  ];
  if (includeDiagonals) {
    modifications.push(
      { x: -1, y: -1 },
      { x: 1, y: -1 },
      { x: -1, y: 1 },
      { x: 1, y: 1 }
    );
  }
  return modifications;
}

export function getAdjacentCoords<A>(
  map: Grid<A>,
  coord: Coord,
  includeDiagonals: boolean = false
): Coord[] {
  const yMax = map.length;
  const xMax = map[0].length;

  const allAdjacentCoords = allDirections(includeDiagonals).map((mod) => ({
    x: coord.x + mod.x,
    y: coord.y + mod.y,
  }));
  return allAdjacentCoords.filter((adjCoord) =>
    inBounds(adjCoord.x, adjCoord.y, xMax, yMax)
  );
}

export function inBounds(
  x: number,
  y: number,
  xMax: number,
  yMax: number
): boolean {
  return x >= 0 && x < xMax && y >= 0 && y < yMax;
}

export function transpose<A>(grid: Grid<A>): Grid<A> {
  return grid[0].map((col, i) => grid.map((row) => row[i]));
}

export function getGridLine<A>(
  grid: Grid<A>,
  direction: Coord,
  start: Coord,
  condition: (grid: Grid<A>, coord: Coord, line: A[]) => boolean = (_g, _c, _l) => true
): A[] {
  const line: A[] = [];
  let current = start;
  while (inBounds(current.x, current.y, grid[0].length, grid.length) && condition(grid, current, line)) {
    line.push(grid[current.y][current.x]);
    current = {x: current.x + direction.x, y: current.y + direction.y};
  }
  return line;
}

export function getGridLines<A>(
  grid: Grid<A>,
  start: Coord,
  includeDiagonals: boolean = false,
  condition: (grid: Grid<A>, coord: Coord, line: A[]) => boolean = (_g, _c, _l) => true
): Grid<A> {
  return allDirections(includeDiagonals).map((direction) =>
    getGridLine(grid, direction, start, condition)
  );
}

export function rotateClockwise(direction: Direction): Direction {
  return direction === Direction.Up ? Direction.Right : 
         direction === Direction.Right ? Direction.Down :
         direction === Direction.Down ? Direction.Left :
         Direction.Up;
}

export function directionToModifier(direction: Direction): Coord {
  return direction === Direction.Up ? { x: 0, y: -1 } :
         direction === Direction.Right ? { x: 1, y: 0 } :
         direction === Direction.Down ? { x: 0, y: 1 } :
         { x: -1, y: 0 };
}

export function isAdjacent(coord1: Coord, coord2: Coord): boolean {
  return Math.abs(coord1.x - coord2.x) + Math.abs(coord1.y - coord2.y) === 1;
}

export type ContiguousRegions<T> = Map<T, Coord[][]>;

export function contiguousRegions<T>(grid: Grid<T>): ContiguousRegions<T> {
  const regions: Map<T, Coord[][]> = new Map();
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const item = grid[y][x];
      const existingRegions = regions.get(item) || [];

      if (!existingRegions) {
        regions.set(item, [[{ x, y }]]);
        continue;
      }

      let regionsToAdd = [...existingRegions];
      const contiguousRegionIndex = regionsToAdd.findIndex((region) =>
        region.some((coord) => isAdjacent(coord, { x, y }))
      );

      if (contiguousRegionIndex === -1) {
        regionsToAdd.push([{ x, y }]);
      } else {
        const firstContiguousRegion = regionsToAdd[contiguousRegionIndex];
        const regionsWithoutFirstContiguousOne = regionsToAdd.slice(0, contiguousRegionIndex)
          .concat(regionsToAdd.slice(contiguousRegionIndex + 1));
        const secondContiguousRegionIndex =
          regionsWithoutFirstContiguousOne.findIndex((region) =>
            region.some((coord) => isAdjacent(coord, { x, y }))
          );
        if (secondContiguousRegionIndex === -1) {
          regionsToAdd[contiguousRegionIndex].push({ x, y });
        } else {
          // Multiple contiguous regions => merge them together
          const secondContiguousRegion = regionsWithoutFirstContiguousOne[secondContiguousRegionIndex];
          secondContiguousRegion.push({ x, y });
          const combinedRegion = firstContiguousRegion.concat(secondContiguousRegion);
          const existingRegionsWithoutCombined = regionsWithoutFirstContiguousOne.slice(0, secondContiguousRegionIndex)
            .concat(regionsWithoutFirstContiguousOne.slice(secondContiguousRegionIndex + 1));
          const fullRegions = [...existingRegionsWithoutCombined, combinedRegion];
          regionsToAdd = [...fullRegions];
        }
      }
      regions.set(item, regionsToAdd);
    }
  }
  return regions;
}

export function getRegionPerimeter<T>(grid: Grid<T>, region: Coord[]): number {
  return region.reduce((acc, coord) => {
    const adjacentCoords = getAdjacentCoords(grid, coord);
    const count = adjacentCoords.filter((adjCoord) => 
      region.some(({x, y}) => x === adjCoord.x && y === adjCoord.y)
    ).length;
    return acc + (4 - count);
  }, 0);
}

export function getScaledRegionPerimeter<T>(grid: Grid<T>, region: Coord[]): number {

  return region.reduce((acc, coord) => {
    const adjacentCoords = getAdjacentCoords(grid, coord);
    const count = adjacentCoords.filter((adjCoord) =>
      region.some(({ x, y }) => x === adjCoord.x && y === adjCoord.y)
    ).length;
    return acc + (4 - count);
  }, 0);
}
