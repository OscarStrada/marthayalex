import { Component, type ReactNode } from "react";

// WebGL can fail to initialize on some browsers/devices/sandboxes. Without
// this, ThreeBackground throwing would take down the entire page instead of
// just skipping the decorative leaves effect.
export default class ThreeBackgroundBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
