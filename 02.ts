import { all, any, loadFromFile } from "./lib.ts";

async function main() {
  const lines = await loadFromFile("./02-input.txt");
  const reports = parseReports(lines);
  console.log(`Part 1: ${partOne(reports)}`);
  console.log(`Part 2: ${partTwo(reports)}`);
}

function partOne(reports: number[][]): number {
  const reportDifferences = reports.map(differences);
  return reportDifferences.map(reportIsSafe).filter(x => !!x).length;
}

function partTwo(reports: number[][]): number {
  const allReportsWithVariants = reports.map(generateAllReportVariants);
  return allReportsWithVariants.map(reportVariants =>
    any(reportVariants.map(differences).map(reportIsSafe))
  ).filter((x) => !!x).length;
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

function generateAllReportVariants(report: number[]): number[][] {
  const variants: number[][] = [];
  for (let i = 0; i < report.length; i++) {
    const variant = report.slice(0, i).concat(report.slice(i + 1));
    variants.push(variant);
  }
  return variants;
}

function parseReports(lines: string[]): number[][] {
  return lines.map((line) => line.split(" ").map((s) => parseInt(s, 10)));
}

main();
