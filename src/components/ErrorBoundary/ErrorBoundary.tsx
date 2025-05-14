"use client";

import React, { ErrorInfo } from "react";

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Uncaught error:", error, info);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, border: "2px solid red", borderRadius: 4 }}>
          <h2>Etwas ist schiefgelaufen!</h2>
          <button onClick={this.resetError}>
            Erneut versuchen
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
