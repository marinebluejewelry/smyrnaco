"use client";

import { Component, type ReactNode } from "react";

// ---------------------------------------------------------------------------
// WebGLErrorBoundary — catches WebGL context loss and R3F render errors.
//
// When a mobile GPU runs out of memory or the WebGL context is lost, R3F
// throws an error that would otherwise crash the entire page. This boundary
// catches it and shows a retry button that remounts the 3D scene.
//
// Wrap around the container that holds <Scene> (not inside R3F Canvas).
// ---------------------------------------------------------------------------

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class WebGLErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90">
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-white/40 mb-4">
            3D view unavailable
          </p>
          <button
            onClick={this.handleRetry}
            className="border border-white/15 bg-black/60 backdrop-blur-sm px-5 py-2.5 text-[0.6rem] uppercase tracking-[0.2em] text-white/50 transition-all duration-300 hover:bg-white/10 hover:text-white hover:border-white/30"
          >
            Tap to retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default WebGLErrorBoundary;
