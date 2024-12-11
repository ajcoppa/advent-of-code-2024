import { loadFromFile } from "./lib.ts";

async function main() {
  const lines = await loadFromFile("./11-input.txt");
  const stones = parseStones(lines);
  console.log(`Part 1: ${partOne(stones)}`);
  console.log(`Part 2: ${partTwo(stones)}`);
}

function partOne(stones: Map<number, number>): number {
  let newStones = stones;
  for (let i = 0; i < 25; i++) {
    newStones = blink(newStones);
  }
  let count = 0;
  for (const [_stone, amount] of newStones) {
    count += amount;
  }
  return count;
}

function partTwo(stones: Map<number, number>): number {
  let newStones = stones;
  for (let i = 0; i < 75; i++) {
    newStones = blink(newStones);
  }

  let count = 0;
  for (const [_stone, amount] of newStones) {
    count += amount;
  }
  return count;
}

function blink(stones: Map<number, number>): Map<number, number> {
  const newStones = new Map<number, number>();
  for (const [stone, count] of stones) {
    if (stone === 0) {
      newStones.set(1, (newStones.get(1) || 0) + count);
    } else if (`${stone}`.length % 2 === 0) {
      const stoneStr = `${stone}`;
      const stone1 = parseInt(stoneStr.slice(0, stoneStr.length / 2), 10);
      const stone2 = parseInt(stoneStr.slice(stoneStr.length / 2), 10);
      newStones.set(stone1, (newStones.get(stone1) || 0) + count);
      newStones.set(stone2, (newStones.get(stone2) || 0) + count);
    } else {
      newStones.set(stone * 2024, (newStones.get(stone * 2024) || 0) + count);
    }
  }
  return newStones;
}

function parseStones(lines: string[]): Map<number, number> {
  const stonesMap = new Map<number, number>();
  lines[0].split(" ").forEach((c) => {
    const stone = parseInt(c, 10);
    stonesMap.set(stone, (stonesMap.get(stone) || 0) + 1);
  });
  return stonesMap;
}

main();
