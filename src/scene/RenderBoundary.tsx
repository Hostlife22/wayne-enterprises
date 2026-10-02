import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface BoundaryProps {
  children: ReactNode;
}
interface BoundaryState {
  failed: boolean;
}

export class RenderBoundary extends Component<BoundaryProps, BoundaryState> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Vehicle renderer failed", error, info.componentStack);
  }
  render() {
    return this.state.failed ? (
      <div className="viewer-fallback" role="alert">
        The 3D renderer could not start.{" "}
        <button onClick={() => window.location.reload()}>Reload viewer</button>
        <p>Specifications and configuration controls remain available below.</p>
      </div>
    ) : (
      this.props.children
    );
  }
}
