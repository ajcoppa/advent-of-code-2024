import { loadFromFile } from "./lib.ts";

async function main() {
  const lines = await loadFromFile("./11-input.txt");
  const stones = parseStones(lines);
  console.log(`Part 1: ${partOne(stones)}`);
}

function partOne(stones: number[]): number {
  let newStones = stones;
  for (let i = 0; i < 25; i++) {
    newStones = blink(newStones);
  }
  return newStones.length;
}

function blink(stones: number[]): number[] {
  return stones.map((stone) => {
    if (stone === 0) return [1];
    else if (`${stone}`.length % 2 === 0) {
      const stoneStr = `${stone}`;
      return [
        parseInt(stoneStr.slice(0, stoneStr.length / 2), 10),
        parseInt(stoneStr.slice(stoneStr.length / 2), 10),
      ];
    } else {
      return [stone * 2024];
    }
  }).flat();
}

function parseStones(lines: string[]): number[] {
  return lines[0].split(" ").map((n) => parseInt(n, 10));
}

main();
