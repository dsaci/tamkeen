import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-rose-50 p-4 text-center">
                    <h1 className="text-3xl font-bold text-rose-700 mb-4">عذراً، حدث خطأ غير متوقع</h1>
                    <p className="text-rose-600 mb-6 max-w-md">نحن نعتذر عن هذا الخطأ. يرجى إعادة تحميل الصفحة أو الاتصال بالدعم الفني إذا استمرت المشكلة.</p>
                    <div className="bg-white p-4 rounded shadow text-left text-xs text-slate-500 overflow-auto max-w-lg max-h-40">
                        {this.state.error?.toString()}
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition"
                    >
                        إعادة التحميل
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
