// components/ui/StepIndicator.jsx
import React from "react";
import { Phone, Key } from "lucide-react";

export const StepIndicator = ({ currentStep }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.75rem",
      marginBottom: "1.5rem",
    }}
  >
    <Step
      active={currentStep === 1}
      completed={currentStep > 1}
      icon={Phone}
      label="Teléfono"
    />
    <div
      style={{
        width: "3rem",
        height: "1px",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#60a5fa",
          width: currentStep > 1 ? "100%" : "0%",
          transition: "width 0.5s",
        }}
      />
    </div>
    <Step active={currentStep === 2} icon={Key} label="Verificación" />
  </div>
);

const Step = ({ active, completed, icon: Icon, label }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.375rem 0.75rem",
      borderRadius: "9999px",
      fontSize: "0.75rem",
      fontWeight: 500,
      backgroundColor: active
        ? "#3b82f6"
        : completed
          ? "rgba(34, 197, 94, 0.2)"
          : "rgba(255, 255, 255, 0.1)",
      color: active ? "white" : completed ? "#86efac" : "#bfdbfe",
      border: completed ? "1px solid rgba(34, 197, 94, 0.3)" : "none",
      transform: active ? "scale(1.05)" : "scale(1)",
      transition: "all 0.3s",
    }}
  >
    <Icon style={{ width: "0.75rem", height: "0.75rem" }} />
    <span>{label}</span>
    {completed && !active && (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: "#4ade80" }}
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    )}
  </div>
);
