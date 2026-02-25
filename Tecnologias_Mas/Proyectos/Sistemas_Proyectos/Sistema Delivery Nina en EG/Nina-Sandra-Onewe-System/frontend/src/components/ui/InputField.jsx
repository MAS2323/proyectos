// components/ui/InputField.jsx
import React from "react";

export const InputField = ({
  icon: Icon,
  label,
  error,
  className = "",
  iconColor = "text-blue-300",
  inputRef,
  ...props
}) => (
  <div style={{ marginBottom: "1.25rem" }}>
    {label && (
      <label
        style={{
          display: "block",
          fontSize: "0.75rem",
          fontWeight: 600,
          color: "#bfdbfe",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginLeft: "0.25rem",
          marginBottom: "0.5rem",
        }}
      >
        {label}
      </label>
    )}
    <div style={{ position: "relative" }}>
      {Icon && (
        <Icon
          style={{
            position: "absolute",
            left: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            width: "1.25rem",
            height: "1.25rem",
            color: "#93c5fd",
          }}
        />
      )}
      <input
        ref={inputRef}
        style={{
          width: "100%",
          paddingLeft: Icon ? "3rem" : "1rem",
          paddingRight: "1rem",
          paddingTop: "1rem",
          paddingBottom: "1rem",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "0.75rem",
          color: "white",
          fontSize: "1rem",
          outline: "none",
          transition: "all 0.2s",
        }}
        {...props}
      />
    </div>
    {error && (
      <p
        style={{
          fontSize: "0.75rem",
          color: "#f87171",
          marginLeft: "0.25rem",
          marginTop: "0.25rem",
        }}
      >
        {error}
      </p>
    )}
  </div>
);
