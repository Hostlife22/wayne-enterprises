import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

interface ContextMonitorProps {
  onLost: () => void;
}

export function ContextMonitor({ onLost }: ContextMonitorProps) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("webglcontextlost", onLost);
    return () => canvas.removeEventListener("webglcontextlost", onLost);
  }, [gl, onLost]);
  return null;
}
