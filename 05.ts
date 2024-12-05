import fs from "node:fs/promises";
import { sum } from "./lib.ts";

async function main() {
  const text = await fs.readFile("./05-input.txt", { encoding: "utf-8" });
  const [ruleLines, orderingLines] = text.split("\n\n");
  const rules = parseRules(ruleLines.split("\n"));
  const orderings = parseOrderings(orderingLines.split("\n"));
  console.log(`Part 1: ${partOne(rules, orderings)}`);
}

function partOne(rules: number[][], orderings: number[][]): number {
  const indexedRules = rules.reduce((acc, [key, value]) => {
    acc[key] = [...acc[key] || [], value];
    return acc;
  }, {} as Record<number, number[]>);

  const validOrderings = getValidOrderings(indexedRules, orderings);
  const middleNumbers = validOrderings.map((ordering) => {
    return ordering[Math.floor(ordering.length / 2)];
  });

  return sum(middleNumbers);
}

function aBeforeB(numbers: number[], a: number, b: number): boolean {
  const indexB = numbers.indexOf(b);
  return indexB === -1 || numbers.indexOf(a) < indexB;
}

function getValidOrderings(rules: Record<number, number[]>, orderings: number[][]): number[][] {
  return orderings.filter((ordering) => (
    ordering.every((x) => (
      // if no rule for this number, it's valid
      rules[x] === undefined ||
      rules[x].every((y) => aBeforeB(ordering, x, y))
    ))
  ));
}

function parseRules(lines: string[]): number[][] {
  return lines.map((line) => line.split("|").map((n) => parseInt(n, 10)));
}

function parseOrderings(lines: string[]): number[][] {
  return lines.map((line) => line.split(",").map((n) => parseInt(n, 10)));
}

main();
