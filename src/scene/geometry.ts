import { ExtrudeGeometry, Path, Shape, Vector2 } from "three";

export type Profile = ReadonlyArray<readonly [number, number]>;

export const WHEEL_RADIUS = 1;
export const WHEEL_CENTER = 1.025;
export const WHEEL_X = 2.12;
export const TIRE_PROFILE: Profile = [
  [0.59, -0.43],
  [0.64, -0.475],
  [0.76, -0.48],
  [0.85, -0.455],
  [0.94, -0.39],
  [0.984, -0.29],
  [0.995, -0.16],
  [1, 0],
  [0.995, 0.16],
  [0.984, 0.29],
  [0.94, 0.39],
  [0.85, 0.455],
  [0.76, 0.48],
  [0.64, 0.475],
  [0.59, 0.43],
];
export const ARMOR_PROFILE: Profile = [
  [-0.94, -0.37],
  [-1.01, -0.03],
  [-0.8, 0.47],
  [-0.49, 0.7],
  [0.24, 0.79],
  [0.78, 0.52],
  [0.89, 0.04],
  [0.55, -0.4],
  [-0.32, -0.47],
];
export const ARMOR_INSET: Profile = [
  [-0.35, -0.35],
  [-0.56, -0.04],
  [-0.59, 0.21],
  [-0.36, 0.53],
  [0.27, 0.61],
  [0.6, 0.37],
  [0.52, -0.29],
  [0.25, -0.37],
];
export const EQUIPMENT_PROFILE: Profile = [
  [-0.88, -0.26],
  [-0.96, 0.21],
  [-0.47, 0.4],
  [0.18, 0.37],
  [0.71, 0.27],
  [0.81, 0.12],
  [0.79, -0.48],
  [0.27, -0.52],
  [-0.53, -0.42],
];
export const TAIL_PROFILE: Profile = [
  [-0.7, 0.03],
  [-0.67, -0.13],
  [-0.37, -0.39],
  [0.28, -0.4],
  [0.51, -0.19],
  [0.35, 0.04],
  [-0.05, 0.13],
];
export const BAT_PROFILE: Profile = [
  [-0.23, 0.08],
  [-0.13, 0.025],
  [-0.07, 0.02],
  [-0.025, 0.055],
  [0, 0.005],
  [0.025, 0.055],
  [0.07, 0.02],
  [0.13, 0.025],
  [0.23, 0.08],
  [0.18, -0.015],
  [0.08, -0.052],
  [0, -0.12],
  [-0.08, -0.052],
  [-0.18, -0.015],
];

export function panelGeometry(
  profile: Profile,
  depth: number,
  bevel: number,
): ExtrudeGeometry {
  const shape = new Shape(profile.map(([x, y]) => new Vector2(x, y)));
  shape.closePath();
  return new ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel > 0,
    bevelSize: bevel,
    bevelThickness: bevel,
    bevelSegments: 1,
    steps: 1,
    curveSegments: 1,
  });
}
export function brakeRotorGeometry(): ExtrudeGeometry {
  const circlePoints = (
    x: number,
    y: number,
    radius: number,
    segments: number,
    clockwise: boolean,
  ) =>
    Array.from({ length: segments }, (_, i) => {
      const angle = (i / segments) * Math.PI * 2 * (clockwise ? -1 : 1);
      return new Vector2(
        x + Math.cos(angle) * radius,
        y + Math.sin(angle) * radius,
      );
    });
  const shape = new Shape(circlePoints(0, 0, 0.525, 96, false));
  shape.closePath();
  const hub = new Path(circlePoints(0, 0, 0.295, 64, true));
  hub.closePath();
  shape.holes.push(hub);
  for (let row = 0; row < 2; row++)
    for (let i = 0; i < 32; i++) {
      const angle = ((i + row * 0.5) / 32) * Math.PI * 2;
      const radius = 0.39 + row * 0.086;
      const hole = new Path(
        circlePoints(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          0.014,
          8,
          true,
        ),
      );
      hole.closePath();
      shape.holes.push(hole);
    }
  return new ExtrudeGeometry(shape, {
    depth: 0.026,
    bevelEnabled: false,
    curveSegments: 1,
    steps: 1,
  });
}
