// components/login/LoginCard.jsx (actualizado con error)
import React from "react";
import { Logo } from "../ui/Logo";
import { StepIndicator } from "../ui/StepIndicator";
import { ErrorMessage } from "../ui/ErrorMessage";
import { PhoneStep } from "./PhoneStep";
import { OTPStep } from "./OTPStep";

export const LoginCard = ({
  step,
  form,
  setForm,
  onSubmit,
  onBack,
  loading,
  shake,
  error,
  otpRef,
}) => (
  <div
    style={{
      width: "100%",
      maxWidth: "28rem",
      transform: shake ? "translateX(4px)" : "translateX(0)",
      transition: "transform 0.1s",
    }}
    className={shake ? "animate-shake" : ""}
  >
    <Logo />

    <div
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "1.5rem",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        overflow: "hidden",
      }}
    >
      {/* Progress Bar */}
      <div
        style={{
          display: "flex",
          height: "6px",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "linear-gradient(to right, #3b82f6, #a855f7, #22c55e)",
            width: step === 1 ? "50%" : "100%",
            transition: "width 0.7s ease-out",
          }}
        />
      </div>

      <div style={{ padding: "2rem" }}>
        <StepIndicator currentStep={step} />

        {/* Mostrar error si existe */}
        <ErrorMessage message={error} />

        {step === 1 ? (
          <PhoneStep
            form={form}
            onChange={setForm}
            onRoleChange={setForm}
            onSubmit={onSubmit}
            loading={loading}
          />
        ) : (
          <OTPStep
            form={form}
            onChange={setForm}
            onSubmit={onSubmit}
            onBack={onBack}
            loading={loading}
            inputRef={otpRef}
            phone={form.telefono}
          />
        )}
      </div>
    </div>
  </div>
);
