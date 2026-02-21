import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 border border-rose-500/20">
             <AlertTriangle size={40} className="text-rose-500" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Something went wrong</h1>
          <p className="text-slate-400 max-w-md mb-8 text-sm">
            The application encountered an unexpected error. Please try refreshing the page.
          </p>
          {this.state.error && (
             <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-8 max-w-lg overflow-auto w-full text-left">
                <code className="text-rose-400 text-xs font-mono">{this.state.error.toString()}</code>
             </div>
          )}
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all"
          >
            <RefreshCw size={18} />
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
