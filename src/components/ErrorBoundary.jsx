import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="bg-card border border-destructive/50 rounded-lg p-8 max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-destructive" />
              <h1 className="text-xl font-bold text-foreground">Something went wrong</h1>
            </div>
            
            <p className="text-muted-foreground mb-4">
              An unexpected error occurred. Please try refreshing the page.
            </p>

            {process.env.NODE_ENV === 'development' && (
              <div className="bg-muted p-3 rounded mb-4 max-h-48 overflow-auto">
                <p className="text-xs font-mono text-destructive mb-2">
                  {this.state.error?.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="text-xs text-muted-foreground">
                    <summary className="cursor-pointer font-semibold mb-2">
                      Stack Trace
                    </summary>
                    <pre className="whitespace-pre-wrap break-words">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
