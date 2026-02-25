// components/ui/ErrorMessage.jsx
import React from "react";
import { AlertCircle } from "lucide-react";

export const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.75rem 1rem",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        border: "1px solid rgba(239, 68, 68, 0.3)",
        borderRadius: "0.5rem",
        marginBottom: "1rem",
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      <AlertCircle
        style={{
          width: "1rem",
          height: "1rem",
          color: "#f87171",
          flexShrink: 0,
        }}
      />
      <p style={{ fontSize: "0.875rem", color: "#fca5a5", margin: 0 }}>
        {message}
      </p>
    </div>
  );
};
