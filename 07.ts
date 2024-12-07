import { loadFromFile } from "./lib.ts";

async function main() {
  const lines = await loadFromFile("./07-input.txt");
  const equations = parseEquations(lines);
  console.log(`Part 1: ${partOne(equations)}`);
  console.log(`Part 2: ${partTwo(equations)}`);
}

function partOne(equations: Map<number, number[]>) {
  return go(equations, [add, mul]);
}

function partTwo(equations: Map<number, number[]>) {
  return go(equations, [add, mul, concat]);
}

function go(equations: Map<number, number[]>, allowedOperations: ((a: number, b: number) => number)[]) {
  let total = 0;
  equations.forEach((operands, target) => {
    if (possibleValues(operands, allowedOperations).includes(target)) {
      total += target;
    }
  });
  return total;
}

const add = (a: number, b: number) => a + b;
const mul = (a: number, b: number) => a * b;
const concat = (a: number, b: number) => parseInt(`${a}${b}`, 10);

const possibleValues = (
  operands: number[],
  allowedOperations: ((a: number, b: number) => number)[]
): number[] => {
  if (operands.length === 1) {
    return [operands[0]];
  }

  return allowedOperations.map((op) =>
    possibleValues(operands.slice(0, operands.length - 1), allowedOperations).map((b) =>
      op(b, operands[operands.length - 1])
    )
  ).flat();
};

function parseEquations(lines: string[]): Map<number, number[]> {
  return lines.map((line) => {
    const [targetRaw, operandsRaw] = line.split(":");
    const target = parseInt(targetRaw, 10);
    const operands = operandsRaw.trim().split(" ").map((n) => parseInt(n, 10));
    return { target, operands };
  }).reduce((acc, { target, operands }) => {
    acc.set(target, operands);
    return acc;
  }, new Map() as Map<number, number[]>);
}

main();
