export function positiveDomain(values: number[]): [number, number] {
  const positive = values.filter((value) => Number.isFinite(value) && value > 0);
  if (!positive.length) return [1, 10];
  return [Math.max(1, Math.min(...positive)), Math.max(...positive)];
}
