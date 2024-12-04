export type Coord = {
  x: number;
  y: number;
};

export type Grid<A> = A[][];

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
