import { loadFromFile } from "./lib.ts";

async function main() {
  const lines = await loadFromFile("./07-input.txt");
  const equations = parseEquations(lines);
  console.log(`Part 1: ${partOne(equations)}`);
}

function partOne(equations: Map<number, number[]>) {
  let total = 0;
  equations.forEach((operands, target) => {
    if (possibleValues(operands).includes(target)) {
      total += target;
    }
  });
  return total;
}

const possibleValues = (operands: number[]): number[] => {
  if (operands.length === 1) {
    return [operands[0]];
  }

  const add = (a: number, b: number) => a + b;
  const mul = (a: number, b: number) => a * b;
  return [add, mul].map((op) =>
    possibleValues(operands.slice(0, operands.length - 1)).map((b) =>
      op(operands[operands.length - 1], b)
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
