import React from 'react';

class ErrorBoundary extends React.Component<React.PropsWithChildren> {
  state = {
    hasError: false,
    error: null as Error | null,
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Oops, there is an error!</h2>
          <pre>{this.state.error?.toString()}</pre>
          <button type='button' onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
