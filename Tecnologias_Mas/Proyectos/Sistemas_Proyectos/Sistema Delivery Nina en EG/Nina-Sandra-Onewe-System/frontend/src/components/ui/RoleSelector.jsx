// components/ui/RoleSelector.jsx
import React from "react";
import { User, Store, Building2, Grid3X3 } from "lucide-react";

const roles = [
  { id: "cliente", label: "Cliente", icon: User },
  { id: "abaceria", label: "Abacería", icon: Store },
  { id: "agencia", label: "Agencia", icon: Building2 },
  { id: "matriz", label: "Matriz", icon: Grid3X3 },
];

export const RoleSelector = ({ value, onChange, disabled }) => (
  <div style={{ marginBottom: "1.25rem" }}>
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
      Tipo de Usuario
    </label>
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}
    >
      {roles.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          disabled={disabled}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem",
            borderRadius: "0.75rem",
            border: "1px solid",
            borderColor:
              value === id
                ? "rgba(59, 130, 246, 0.5)"
                : "rgba(255, 255, 255, 0.1)",
            backgroundColor:
              value === id
                ? "rgba(59, 130, 246, 0.2)"
                : "rgba(255, 255, 255, 0.05)",
            color: value === id ? "white" : "#bfdbfe",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.5 : 1,
            transition: "all 0.2s",
            transform: value === id ? "scale(1.02)" : "scale(1)",
          }}
        >
          <Icon style={{ width: "1rem", height: "1rem" }} />
          <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{label}</span>
        </button>
      ))}
    </div>
  </div>
);
