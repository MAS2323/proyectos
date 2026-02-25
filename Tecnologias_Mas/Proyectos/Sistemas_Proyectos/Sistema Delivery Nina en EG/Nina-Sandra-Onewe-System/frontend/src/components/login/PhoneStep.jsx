// components/login/PhoneStep.jsx
import React from "react";
import { ArrowRight, Phone } from "lucide-react";
import { InputField } from "../ui/InputField";
import { Button } from "../ui/Button";
import { RoleSelector } from "../ui/RoleSelector";

export const PhoneStep = ({
  form,
  onChange,
  onRoleChange,
  onSubmit,
  loading,
}) => {
  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, "").replace(/^240/, "");
    if (cleaned.length === 0) return "+240 ";
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,3})$/);
    if (match) {
      return `+240 ${match[1]}${match[2] ? " " + match[2] : ""}${match[3] ? " " + match[3] : ""}`.trim();
    }
    return value;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    onChange({ ...form, telefono: formatted });
  };

  const isValid = form.telefono.replace(/\D/g, "").length > 6;

  return (
    <div className="animate-fade-in">
      <InputField
        icon={Phone}
        label="Número de Teléfono"
        type="tel"
        name="telefono"
        placeholder="+240 123 456 789"
        value={form.telefono}
        onChange={handlePhoneChange}
        disabled={loading}
      />

      <p
        style={{
          fontSize: "0.75rem",
          color: "rgba(147, 197, 253, 0.6)",
          marginLeft: "0.25rem",
          marginTop: "-0.5rem",
          marginBottom: "1rem",
        }}
      >
        Formato: +240 XXX XXX XXX
      </p>

      <RoleSelector
        value={form.rol}
        onChange={(rol) => onRoleChange({ ...form, rol })}
        disabled={loading}
      />

      <Button
        onClick={onSubmit}
        loading={loading}
        disabled={!isValid}
        style={{ marginTop: "0.5rem" }}
      >
        <>
          Continuar
          <ArrowRight style={{ width: "1.25rem", height: "1.25rem" }} />
        </>
      </Button>
    </div>
  );
};
