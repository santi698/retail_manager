import parse from "multi-number-parse";

export function isValidDecimal(numString: string): boolean {
  return !isNaN(parse(numString, ","));
}

export function parseDecimal(numString: string): number {
  const number = parse(numString, ",");

  if (isNaN(number)) {
    throw new Error(`Can't parse decimal from string ${numString}`);
  }

  return number;
}
