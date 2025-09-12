import React from "react";

interface LoadingSpinnerProps {
    size?: "small" | "medium" | "large";
    color?: string;
    text?: string;
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = "medium",
    color = "#4299e1",
    text,
    className = "",
}) => {
    const sizeMap = {
        small: "16px",
        medium: "32px",
        large: "48px",
    };

    const spinnerStyle = {
        width: sizeMap[size],
        height: sizeMap[size],
        border: `3px solid #f3f3f3`,
        borderTop: `3px solid ${color}`,
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    };

    return (
        <div
            className={`loading-spinner-container ${className}`}
            style={{ textAlign: "center" }}
        >
            <div
                className="loading-spinner"
                style={spinnerStyle}
                role="status"
                aria-label="Loading"
            ></div>
            {text && (
                <p
                    style={{
                        marginTop: "8px",
                        color: "#666",
                        fontSize:
                            size === "small"
                                ? "12px"
                                : size === "medium"
                                  ? "14px"
                                  : "16px",
                    }}
                >
                    {text}
                </p>
            )}
            <style jsx>{`
                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }

                .loading-spinner-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>
        </div>
    );
};

export default LoadingSpinner;
