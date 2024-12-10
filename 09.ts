import { Option, isNone, isSome, some, none } from "jsr:@baetheus/fun/option";

import { loadFromFile, repeat } from "./lib.ts";

async function main() {
  const lines = await loadFromFile("./09-input.txt");
  const diskMap = parseDiskMap(lines);
  console.log(`Part 1: ${partOne(diskMap)}`);
  console.log(`Part 2: ${partTwo(diskMap)}`);
}

function partOne(diskMap: Block[]): number {
  return checksum(compact(diskMap));
}

function partTwo(diskMap: Block[]): number {
  return checksum(compactContiguous(diskMap));
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

function compactContiguous(blocks: Block[]): Block[] {
  const newBlocks = blocks.slice();
  let j = newBlocks.length - 1;
  const moved: Map<number, boolean> = new Map();
  let file = getNextFile(newBlocks, j, moved);
  
  while (isSome(file)) {
    const [fileStart, fileEnd] = file.value;
    const data = newBlocks[fileEnd];
    const emptyBlock = firstEmptyBlock(newBlocks, fileEnd - fileStart + 1, fileStart);
    if (isNone(emptyBlock)) {
      j = fileStart - 1;
      file = getNextFile(newBlocks, j, moved);
      continue;
    }

    const [emptyStart, emptyEnd] = emptyBlock.value;
    for (let x = emptyStart; x < emptyEnd; x++) {
      newBlocks[x] = data;
    }
    for (let y = fileStart; y <= fileEnd; y++) {
      newBlocks[y] = none;
    }
    if (isSome(data)) moved.set(data.value, true);

    j = fileStart - 1;
    file = getNextFile(newBlocks, j, moved);
  }
  return newBlocks;
}

function getNextFile(blocks: Block[], start: number, moved: Map<number, boolean>): Option<[number, number]> {
  if (start < 0) return none;

  let fileEnd = start;
  let data = blocks[fileEnd];
  let alreadyMoved = isSome(data) && moved.get(data.value);
  while (((blocks[fileEnd] === none) || alreadyMoved) && fileEnd >= 0) {
    fileEnd--;
    data = blocks[fileEnd];
    alreadyMoved = isSome(data) && moved.get(data.value);
  }
  if (fileEnd < 0) return none;

  let fileStart = fileEnd;
  while (blocks[fileStart] === blocks[fileEnd] && fileStart >= 0) fileStart--;
  return some([fileStart + 1, fileEnd]);
}

function firstEmptyBlock(blocks: Block[], size: number, before: number): Option<[number, number]> {
  let i = 0, start;
  while (i < before) {
    if (isSome(blocks[i])) {
      i++;
      continue;
    } 

    start = i;
    if (blocks.slice(start, start + size).every((block) => isNone(block))) {
      return some([start, start + size]);
    } else {
      i++;
    }
  }
  return none;
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
