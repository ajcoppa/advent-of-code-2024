import { loadFromFile } from "./lib.ts";

async function main() {
  const lines = await loadFromFile("./03-input.txt");
  console.log(`Part 1: ${partOne(lines)}`); 
  console.log(`Part 2: ${partTwo(lines)}`); 
}

function partOne(lines: string[]) {
  return parseInstructionsOne(lines).reduce((acc, [x, y]) => {
    return acc + x * y;
  }, 0);
}

function partTwo(lines: string[]) {
  const result = parseInstructionsTwo(lines).reduce((acc, instruction) => (
    instruction === "don't" ? {enabled: false, count: acc.count} :
    instruction === "do" ? {enabled: true, count: acc.count} :
    acc.enabled ? {enabled: acc.enabled, count: acc.count + instruction[0] * instruction[1]} :
    acc
  ), {count: 0, enabled: true});
  return result.count;
}

function parseInstructionsOne(lines: string[]): number[][] {
  return lines.map((line) => {
    const matches = [...line.matchAll(/mul\((\d{1,3})\,(\d{1,3})\)/g)];
    return matches.map((match) => {
      return [parseInt(match[1], 10), parseInt(match[2], 10)];
    });
  }).flat();
}

function parseInstructionsTwo(lines: string[]): Instruction[] {
  return lines.map((line) => {
    const matches = [
      ...line.matchAll(/mul\((\d{1,3})\,(\d{1,3})\)|(don\'t\(\))|(do\(\))/g),
    ];
    return matches.map((match) => {
      return match[0] === "do()" ? "do" :
        match[0] === "don't()" ? "don't" :
        [parseInt(match[1], 10), parseInt(match[2], 10)];
    });
  }).flat();
}

type Instruction = "do" | "don't" | number[];

main();
