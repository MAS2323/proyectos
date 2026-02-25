// components/login/OTPStep.jsx
import React from "react";
import { ArrowRight, ArrowLeft, Key } from "lucide-react";
import { InputField } from "../ui/InputField";
import { Button } from "../ui/Button";

export const OTPStep = ({
  form,
  onChange,
  onSubmit,
  onBack,
  loading,
  inputRef,
  phone,
}) => (
  <div className="animate-fade-in">
    <InputField
      icon={Key}
      label="Código de Verificación"
      inputRef={inputRef}
      type="text"
      name="otp"
      placeholder="000000"
      value={form.otp}
      onChange={(e) =>
        onChange({
          ...form,
          otp: e.target.value.replace(/\D/g, "").slice(0, 6),
        })
      }
      disabled={loading}
      maxLength={6}
      inputMode="numeric"
      style={{
        textAlign: "center",
        fontSize: "1.5rem",
        letterSpacing: "0.5em",
        fontFamily: "monospace",
      }}
    />

    <p
      style={{
        fontSize: "0.75rem",
        color: "rgba(147, 197, 253, 0.6)",
        textAlign: "center",
        marginBottom: "1rem",
      }}
    >
      Código enviado a{" "}
      <span style={{ color: "#93c5fd", fontWeight: 500 }}>{phone}</span>
    </p>

    <Button
      variant="success"
      onClick={onSubmit}
      loading={loading}
      disabled={form.otp.length < 6}
      style={{ marginBottom: "0.5rem" }}
    >
      <>
        Verificar e Ingresar
        <ArrowRight style={{ width: "1.25rem", height: "1.25rem" }} />
      </>
    </Button>

    <Button
      variant="ghost"
      onClick={onBack}
      disabled={loading}
      style={{ padding: "0.75rem", fontSize: "0.875rem" }}
    >
      <>
        <ArrowLeft style={{ width: "1rem", height: "1rem" }} />
        Cambiar número
      </>
    </Button>
  </div>
);
