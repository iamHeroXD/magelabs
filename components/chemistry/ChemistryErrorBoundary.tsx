"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { RefreshCw, AlertTriangle, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ChemistryErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[MageLabs ChemistryErrorBoundary] Caught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-black p-6 font-mono text-zinc-100">
          <div className="w-full max-w-xl rounded-xl border border-red-500/30 bg-zinc-950/90 p-6 shadow-2xl backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold tracking-wider text-red-400 uppercase">
                  Laboratory Subsystem Exception
                </h2>
                <p className="text-xs text-zinc-400">
                  WebGL or React rendering context interrupted
                </p>
              </div>
            </div>

            {/* Error Message */}
            <div className="my-4 rounded-lg bg-zinc-900/80 p-3.5 border border-zinc-800">
              <div className="text-[11px] uppercase tracking-wider text-zinc-500 mb-1">
                Diagnostic Trace
              </div>
              <div className="text-xs text-red-300 font-mono break-all whitespace-pre-wrap max-h-36 overflow-y-auto">
                {this.state.error?.message || "An unexpected rendering exception occurred."}
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              Your experiment state and calculations are secure. This can happen if WebGL context was lost or a shader failed to compile. Reinitializing the laboratory environment will restore your session.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-zinc-900">
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Reload Page
              </button>

              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-medium text-white hover:bg-cyan-500 shadow-lg shadow-cyan-900/30 transition"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Reinitialize 3D Simulation
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
