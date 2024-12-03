import { all, loadFromFile } from "./lib.ts";

async function main() {
  const lines = await loadFromFile("./02-input.txt");
  const reports = parseReports(lines);
  console.log(`Part 1: ${partOne(reports)}`);
}

function partOne(reports: number[][]): number {
  const reportDifferences = reports.map(differences);
  return reportDifferences.map(reportIsSafe).filter(x => !!x).length;
}

function differences(report: number[]): number[] {
  return report.reduce((acc, n, i) => {
    if (i < report.length - 1) {
      acc.push(n - report[i + 1]);
    }
    return acc;
  }, [] as number[]);
}

function reportIsSafe(differenceValues: number[]): boolean {
  return differenceValues.every((n) => Math.abs(n) <= 3 && Math.abs(n) >= 1) &&
    (all(differenceValues.map((n) => n > 0)) || all(differenceValues.map((n) => n < 0)));
}

function parseReports(lines: string[]): number[][] {
  return lines.map((line) => line.split(" ").map((s) => parseInt(s, 10)));
}

main();
