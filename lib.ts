import fs from "node:fs/promises";

export async function loadFromFile(
  path: string,
  filterEmpty: boolean = true
): Promise<string[]> {
  const text = await fs.readFile(path, { encoding: "utf-8" });
  const lines = text.split("\n");
  return filterEmpty ? lines.filter((l) => l.length > 0) : lines;
}

export function identity<A>(x: A) {
  return x;
}

export function any(xs: boolean[]): boolean {
  return xs.reduce((a, b) => a || b, false);
}

export function all(xs: boolean[]): boolean {
  return xs.reduce((a, b) => a && b, true);
}

export function sum(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0);
}

export function product(xs: number[]): number {
  return xs.reduce((a, b) => a * b, 1);
}

export function same<A>(xs: A[]): boolean {
  return all(xs.map((x) => x === xs[0]));
}

export function repeat<A>(x: A, n: number): A[] {
  const xs: A[] = [];
  for (let i = 0; i < n; i++) {
    xs.push(x);
  }
  return xs;
}

export function charIsNumeric(c: string) {
  const zero = "0".charCodeAt(0);
  const nine = "9".charCodeAt(0);
  const cCode = c.charCodeAt(0);
  return cCode >= zero && cCode <= nine;
}

export function chunk<A>(list: A[], chunkSize: number): A[][] {
  const chunks: A[][] = [];
  for (let i = 0; i < list.length; i += chunkSize) {
    const chunk = list.slice(i, i + chunkSize);
    chunks.push(chunk);
  }
  return chunks;
}

export function zip<A>(one: A[], two: A[]): A[][] {
  return one.map(function (elem, i) {
    return [elem, two[i]];
  });
}

export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b;
}

export function lcmAll(xs: number[]): number {
  return xs.reduce(lcm, 1);
}

export function uniquePairs<A>(xs: A[]): A[][] {
  return xs.flatMap((x1, i) => xs.slice(i + 1).map((x2) => [x1, x2]));
}

export function combinations<T>(xs: T[], n: number): T[][] {
  if (n === 0) return [[]];
  if (xs.length < n) return [];
  const [head, ...tail] = xs;
  return [
    ...combinations(tail, n),
    ...combinations(tail, n - 1).map((combo) => [head, ...combo]),
  ];
}

export function deepCopy<T>(xs: T[]): T[] {
  return JSON.parse(JSON.stringify(xs));
}
