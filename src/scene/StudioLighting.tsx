import { Environment, Lightformer } from "@react-three/drei";

export function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 8, 5]} intensity={3} />
      <directionalLight position={[-4, 3, -5]} intensity={2} />
      <Environment resolution={128}>
        <Lightformer
          intensity={2}
          position={[0, 3, 6]}
          rotation={[0, Math.PI, 0]}
          scale={[8, 4, 1]}
        />
        <Lightformer
          intensity={4}
          position={[0, 5, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[10, 10, 1]}
        />
        <Lightformer
          intensity={3}
          position={[-5, 2, 3]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[5, 3, 1]}
        />
        <Lightformer intensity={2} position={[3, 3, -5]} scale={[8, 4, 1]} />
      </Environment>
    </>
  );
}
