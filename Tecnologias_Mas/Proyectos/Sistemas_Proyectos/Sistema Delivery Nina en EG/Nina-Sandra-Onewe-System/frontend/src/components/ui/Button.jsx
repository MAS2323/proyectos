// components/ui/Button.jsx
import React from "react";
import { Loader2 } from "lucide-react";

export const Button = ({
  children,
  loading,
  variant = "primary",
  style = {},
  ...props
}) => {
  const baseStyle = {
    width: "100%",
    position: "relative",
    overflow: "hidden",
    color: "white",
    padding: "1rem",
    borderRadius: "0.75rem",
    fontWeight: 600,
    border: "none",
    cursor: props.disabled ? "not-allowed" : "pointer",
    opacity: props.disabled ? 0.5 : 1,
    transition: "all 0.3s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  };

  const variants = {
    primary: {
      background: "linear-gradient(to right, #2563eb, #3b82f6)",
      boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.25)",
    },
    success: {
      background: "linear-gradient(to right, #16a34a, #22c55e)",
      boxShadow: "0 10px 15px -3px rgba(34, 197, 94, 0.25)",
    },
    ghost: {
      background: "transparent",
      boxShadow: "none",
      color: "#93c5fd",
    },
  };

  return (
    <button style={{ ...baseStyle, ...variants[variant], ...style }} {...props}>
      {loading ? (
        <>
          <Loader2
            style={{
              width: "1.25rem",
              height: "1.25rem",
              animation: "spin 1s linear infinite",
            }}
          />
          <span>Procesando...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
