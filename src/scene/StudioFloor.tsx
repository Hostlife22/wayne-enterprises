import { useEffect, useMemo } from "react";
import {
  DataTexture,
  LinearFilter,
  MeshBasicMaterial,
  PlaneGeometry,
  RGBAFormat,
} from "three";
import type { Preset } from "../configuration/types";
import { WHEEL_X } from "./geometry";
import { Mechanism } from "./Motion";

interface StudioFloorProps {
  preset: Preset;
  reduced: boolean;
}

export function StudioFloor({ preset, reduced }: StudioFloorProps) {
  const resources = useMemo(() => {
    const size = 128;
    const pixels = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        const dx = (x / (size - 1) - 0.5) * 2,
          dy = (y / (size - 1) - 0.5) * 2;
        const strength = Math.max(
          0,
          (Math.exp(-4 * (dx * dx + dy * dy)) - Math.exp(-4)) /
            (1 - Math.exp(-4)),
        );
        const offset = (y * size + x) * 4;
        pixels[offset] = 12;
        pixels[offset + 1] = 20;
        pixels[offset + 2] = 24;
        pixels[offset + 3] = Math.round(strength * 255);
      }
    const texture = new DataTexture(pixels, size, size, RGBAFormat);
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.needsUpdate = true;
    const geometry = new PlaneGeometry(1, 1);
    const contact = new MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      toneMapped: false,
    });
    const body = new MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
      toneMapped: false,
    });
    return { texture, geometry, contact, body };
  }, []);
  useEffect(
    () => () => {
      resources.texture.dispose();
      resources.geometry.dispose();
      resources.contact.dispose();
      resources.body.dispose();
    },
    [resources],
  );
  return (
    <group>
      <mesh
        geometry={resources.geometry}
        material={resources.body}
        position={[0, -0.015, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[7.5, 3, 1]}
      />
      {[-1, 1].map((side) => (
        <Mechanism
          key={side}
          amount={preset.wheelbase}
          reduced={reduced}
          to={[side, 0, 0]}
        >
          <mesh
            geometry={resources.geometry}
            material={resources.contact}
            position={[side * WHEEL_X, -0.01, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[1.35, 2.1, 1]}
          />
        </Mechanism>
      ))}
    </group>
  );
}
