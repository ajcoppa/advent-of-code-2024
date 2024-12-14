import fs from "node:fs/promises";
import { sum } from "./lib.ts";
import { Coord } from "./lib/Coord.ts";

async function main() {
  const text = await fs.readFile("13-input.txt", { encoding: "utf-8" });
  const machineStrings = text.split("\n\n");
  const machines = machineStrings.map(parseMachine);
  console.log(`Part 1: ${partOne(machines)}`);
  console.log(`Part 2: ${partTwo(machines)}`);
}

function partOne(machines: Machine[]): number {
  return go(machines);
}

function partTwo(machines: Machine[]): number {
  return go(machines.map((machine) => ({
    ...machine,
    prizeCoord: {
      x: machine.prizeCoord.x + 10000000000000,
      y: machine.prizeCoord.y + 10000000000000,
    },
  })));
}

function go(machines: Machine[]): number {
  return sum(
    machines.map((machine) => {
      const { aPresses, bPresses } = cramersRule(
        machine.buttons[0].x,
        machine.buttons[0].y,
        machine.buttons[1].x,
        machine.buttons[1].y,
        machine.prizeCoord.x,
        machine.prizeCoord.y
      );
      // If a non-integer number of presses were required, there isn't a valid solution
      if (
        Math.floor(aPresses) !== aPresses ||
        Math.floor(bPresses) !== bPresses
      ) {
        return 0;
      }
      return (
        machine.buttons[0].cost * aPresses +
        machine.buttons[1].cost * bPresses
      );
  }));
}

function cramersRule(aX: number, aY: number, bX: number, bY: number, prizeX: number, prizeY: number) {
  const det = aX * bY - aY * bX;
  const aPresses = (prizeX * bY - prizeY * bX) / det;
  const bPresses = (prizeY * aX - prizeX * aY) / det;
  return {aPresses, bPresses};
}

function parseMachine(line: string): Machine {
  const matches = line.matchAll(/.*A: X\+(\d+), Y\+(\d+)\n.*B: X\+(\d+), Y\+(\d+)\n.*Prize: X=(\d+), Y=(\d+).*/g);
  for (const match of matches) {
    const x1 = parseInt(match[1], 10);
    const y1 = parseInt(match[2], 10);
    const x2 = parseInt(match[3], 10);
    const y2 = parseInt(match[4], 10);
    const prizeX = parseInt(match[5], 10);
    const prizeY = parseInt(match[6], 10);
    return {
      buttons: [{x: x1, y: y1, cost: 3}, {x: x2, y: y2, cost: 1}],
      prizeCoord: {x: prizeX, y: prizeY},
    };
  }
  throw new Error("No match found");
}

type Machine = {
  buttons: {x: number, y: number, cost: number}[];
  prizeCoord: Coord;
}

main();
