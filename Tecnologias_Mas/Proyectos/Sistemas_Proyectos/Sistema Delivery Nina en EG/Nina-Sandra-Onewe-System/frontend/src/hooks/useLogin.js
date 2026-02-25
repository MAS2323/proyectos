// hooks/useLogin.js
import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Función utilitaria para limpiar el teléfono
const cleanPhone = (phone) => {
  return phone.replace(/\s/g, ""); // Elimina todos los espacios
};

export const useLogin = (setToken, setRol) => {
  const [form, setForm] = useState({ telefono: "", otp: "", rol: "cliente" });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [error, setError] = useState(null);
  const otpRef = useRef(null);
  const navigate = useNavigate();

  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault();
      setLoading(true);
      setError(null);

      // Limpiar teléfono antes de enviar al backend
      const telefonoLimpio = cleanPhone(form.telefono);

      try {
        if (step === 1) {
          await axios.post("/auth/otp", {
            telefono: telefonoLimpio, // ← Enviar limpio
            rol: form.rol,
          });
          setStep(2);
          setTimeout(() => otpRef.current?.focus(), 100);
        } else {
          const res = await axios.post("/auth/login", {
            telefono: telefonoLimpio, // ← Enviar limpio
            otp: form.otp,
            rol: form.rol,
          });

          localStorage.setItem("token", res.data.token);
          setToken(res.data.token);
          setRol(form.rol);

          const routes = {
            cliente: "/cliente",
            abaceria: "/abaceria/pedidos",
            agencia: "/agencia/seleccion",
            matriz: "/matriz/reportes",
          };
          navigate(routes[form.rol] || "/");
        }
      } catch (err) {
        triggerShake();

        let errorMessage = "Error de conexión. Intenta de nuevo.";

        if (err.response) {
          const status = err.response.status;
          const serverError =
            err.response.data?.error || err.response.data?.message;

          switch (status) {
            case 404:
              errorMessage =
                serverError || "Teléfono no registrado. Verifica el número.";
              break;
            case 401:
              errorMessage = serverError || "Código OTP incorrecto.";
              setForm((prev) => ({ ...prev, otp: "" }));
              break;
            case 403:
              errorMessage = serverError || "Acceso denegado.";
              break;
            case 400:
              errorMessage = serverError || "Datos inválidos.";
              break;
            case 500:
              errorMessage = "Error del servidor.";
              break;
            default:
              errorMessage = serverError || `Error ${status}`;
          }
        } else if (err.request) {
          errorMessage = "No se pudo conectar con el servidor.";
        }

        setError(errorMessage);
        console.error("Login error:", err);
      } finally {
        setLoading(false);
      }
    },
    [step, form, setToken, setRol, navigate, triggerShake],
  );

  const handleBack = useCallback(() => {
    setStep(1);
    setForm((prev) => ({ ...prev, otp: "" }));
    setError(null);
  }, []);

  return {
    form,
    setForm,
    step,
    loading,
    shake,
    error,
    otpRef,
    handleSubmit,
    handleBack,
  };
};
