// components/ui/Logo.jsx
import React from "react";
import { ShieldCheck } from "lucide-react";

export const Logo = () => (
  <div style={{ textAlign: "center", marginBottom: "2rem" }}>
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "5rem",
        height: "5rem",
        background: "linear-gradient(135deg, #3b82f6, #a855f7, #ec4899)",
        borderRadius: "1rem",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        marginBottom: "1rem",
      }}
    >
      <ShieldCheck
        style={{ width: "2.5rem", height: "2.5rem", color: "white" }}
      />
    </div>
    <h1
      style={{
        fontSize: "2.25rem",
        fontWeight: 900,
        marginBottom: "0.5rem",
        background: "linear-gradient(to right, white, #bfdbfe)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      N.S.O. System
    </h1>
    <p
      style={{
        color: "rgba(191, 219, 254, 0.6)",
        fontSize: "0.75rem",
        fontWeight: 700,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
      }}
    >
      Nina Sandra Onewe System
    </p>
  </div>
);
