import { loadFromFile } from "./lib.ts";

async function main() {
  const lines = await loadFromFile("./03-input.txt");
  const instructions = parseInstructions(lines);
  console.log(`Part 1: ${partOne(instructions)}`); 
}

function partOne(instructions: number[][]) {
  return instructions.reduce((acc, [x, y]) => {
    return acc + x * y;
  }, 0);
}

function parseInstructions(lines: string[]) {
  return lines.map((line) => {
    const matches = [...line.matchAll(/mul\((\d{1,3})\,(\d{1,3})\)/g)];
    return matches.map((match) => {
      return [parseInt(match[1], 10), parseInt(match[2], 10)];
    });
  }).flat();
}

main();
