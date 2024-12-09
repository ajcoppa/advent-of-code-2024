import { Option, isSome, some, none } from "jsr:@baetheus/fun/option";

import { loadFromFile, repeat } from "./lib.ts";

async function main() {
  const lines = await loadFromFile("./09-input.txt");
  const diskMap = parseDiskMap(lines);
  console.log(`Part 1: ${partOne(diskMap)}`);
}

function partOne(diskMap: Block[]): number {
  return checksum(compact(diskMap));
}

function compact(blocks: Block[]): Block[] {
  const newBlocks = blocks.slice();
  for (let i = 0, j = newBlocks.length - 1; i < j; i++, j--) {
    while (i < j && isSome(newBlocks[i])) i++;
    while (i < j && !isSome(newBlocks[j])) j--;

    const data = newBlocks[j];
    newBlocks[i] = data;
    newBlocks[j] = blocks[i];
  }

  return newBlocks;
}

function checksum(blocks: Block[]): number {
  return blocks.reduce((acc, block, i) => acc + (isSome(block) ? block.value * i : 0), 0);
}

function parseDiskMap(lines: string[]): Block[] {
  const diskMap = lines.map((line) => line.split("").map((n) => parseInt(n, 10)));
  let data = true;
  let id = 0;
  return diskMap[0].reduce((acc, block) => {
    const itemToRepeat = data ? some(id) : none;
    if (data) id++;
    data = !data;
    return acc.concat(repeat(itemToRepeat, block));
  }, [] as Block[]);
}

type Block = Option<number>;

main();
