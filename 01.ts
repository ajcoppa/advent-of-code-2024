import { loadFromFile, sum } from "./lib.ts";

async function main() {
  const lines = await loadFromFile("./01-input.txt");
  const [first, second] = parseNumberLists(lines);
  console.log(`Part 1: ${partOne(first, second)}`);
}

function partOne(first: number[], second: number[]) {
  const sortedFirst = first.sort((a, b) => a - b);
  const sortedSecond = second.sort((a, b) => a - b);
  const differences = sortedFirst.map((n, i) => Math.abs(n - sortedSecond[i]));
  return sum(differences);
}

function parseNumberLists(lines: string[]): number[][] {
  const parsedLines = lines.map((line) =>
    (line.split("   ").map(c => parseInt(c, 10)))
  );
  return [parsedLines.map(line => line[0]), parsedLines.map(line => line[1])];
}

main();
