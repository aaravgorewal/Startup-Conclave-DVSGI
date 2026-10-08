import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Neo-brutalist Error Boundary that catches runtime errors safely.
 * Displays a friendly recovery screen without leaking internal error details.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Technical diagnostics logged only to console; never displayed to users
    console.error('ErrorBoundary caught technical exception:', error, errorInfo);
  }

  private handleRefresh = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFF8EC] flex items-center justify-center p-4 selection:bg-[#FF6B1A] selection:text-[#111111]">
          <div className="max-w-md w-full p-6 sm:p-8 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-5 text-center">
            <div className="w-12 h-12 bg-[#FFF2D6] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex items-center justify-center mx-auto text-[#FF6B1A]">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <span className="inline-block font-mono text-[11px] font-bold uppercase tracking-wider text-[#111111] bg-[#FFD400] px-2 py-0.5 border border-[#111111]">
                System Notice
              </span>
              <h1 className="font-display font-black text-2xl text-[#111111]">
                Something went wrong
              </h1>
              <p className="font-sans text-sm text-[#111111]/80 leading-relaxed">
                An unexpected problem occurred while rendering this page. Please refresh to try again.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={this.handleRefresh}
                className="brutal-btn bg-[#FF6B1A] hover:bg-[#E05307] text-[#111111] px-5 py-3 font-display font-bold text-xs uppercase tracking-wider border-2 border-[#111111] shadow-[2px_2px_0px_#111111] cursor-pointer inline-flex items-center justify-center gap-2 min-h-[46px] w-full transition-all"
              >
                <RotateCw className="w-4 h-4" />
                <span>Refresh Page</span>
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
