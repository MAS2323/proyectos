// pages/Login.jsx (actualizado)
import React from "react";
import { AuthLayout } from "../components/layout/AuthLayout";
import { LoginCard } from "../components/login/LoginCard";
import { useLogin } from "../hooks/useLogin";

const Login = ({ setToken, setRol }) => {
  const {
    form,
    setForm,
    step,
    loading,
    shake,
    error,
    otpRef,
    handleSubmit,
    handleBack,
  } = useLogin(setToken, setRol);

  return (
    <AuthLayout>
      <LoginCard
        step={step}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        onBack={handleBack}
        loading={loading}
        shake={shake}
        error={error}
        otpRef={otpRef}
      />
    </AuthLayout>
  );
};

export default Login;
