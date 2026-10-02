export function dampValue(
  current: number,
  target: number,
  delta: number,
  reduced = false,
): number {
  return reduced
    ? target
    : current +
        (target - current) *
          (1 -
            Math.exp(
              -7 *
                Math.max(0, Math.min(Number.isFinite(delta) ? delta : 0, 0.05)),
            ));
}
