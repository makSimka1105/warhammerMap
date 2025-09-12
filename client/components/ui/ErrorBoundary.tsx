import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console in development
        if (process.env.NODE_ENV === "development") {
            console.error("ErrorBoundary caught an error:", error, errorInfo);
        }

        // Call the onError callback if provided
        this.props.onError?.(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div
                    style={{
                        padding: "20px",
                        textAlign: "center",
                        border: "1px solid #ff6b6b",
                        borderRadius: "8px",
                        backgroundColor: "#fff5f5",
                        color: "#c53030",
                        margin: "20px",
                    }}
                >
                    <h2>Что-то пошло не так</h2>
                    <p>Произошла ошибка при загрузке компонента.</p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#4299e1",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Попробовать снова
                    </button>
                    {process.env.NODE_ENV === "development" &&
                        this.state.error && (
                            <details
                                style={{ marginTop: "10px", textAlign: "left" }}
                            >
                                <summary>
                                    Детали ошибки (только для разработки)
                                </summary>
                                <pre
                                    style={{
                                        backgroundColor: "#f7fafc",
                                        padding: "10px",
                                        borderRadius: "4px",
                                        overflow: "auto",
                                        fontSize: "12px",
                                    }}
                                >
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
