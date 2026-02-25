import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Phone,
  Key,
  ArrowRight,
  ArrowLeft,
  Loader2,
  User,
  Store,
  Building2,
  Grid3X3,
  ShieldCheck,
} from "lucide-react";

const Login = ({ setToken, setRol }) => {
  const [form, setForm] = useState({ telefono: "", otp: "", rol: "cliente" });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();
  const otpRef = useRef(null);

  // Iconos por rol
  const roleIcons = {
    cliente: <User className="w-4 h-4" />,
    abaceria: <Store className="w-4 h-4" />,
    agencia: <Building2 className="w-4 h-4" />,
    matriz: <Grid3X3 className="w-4 h-4" />,
  };

  const roleLabels = {
    cliente: "Cliente",
    abaceria: "Abacería",
    agencia: "Agencia",
    matriz: "Matriz",
  };

  useEffect(() => {
    if (step === 2) {
      setTimeout(() => otpRef.current?.focus(), 100);
    }
  }, [step]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (step === 1) {
        await axios.post("/auth/otp", {
          telefono: form.telefono,
          rol: form.rol,
        });
        setStep(2);
      } else {
        const res = await axios.post("/auth/login", {
          ...form,
          rol: form.rol,
        });
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setRol(form.rol);

        // Redirección sin alert, con transición suave
        const routes = {
          cliente: "/cliente",
          abaceria: "/abaceria/pedidos",
          agencia: "/agencia/seleccion",
          matriz: "/matriz/reportes",
        };
        navigate(routes[form.rol] || "/");
      }
    } catch (error) {
      setShake(true);
      setTimeout(() => setShake(false), 500);

      const errorMsg =
        error.response?.data?.error || "Verifica tus datos e intenta de nuevo";
      // Podrías usar un toast aquí en lugar de alert
      console.error("Error:", errorMsg);

      if (error.response?.status === 401) {
        setForm({ ...form, otp: "" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const formatPhone = (value) => {
    // Formato automático para +240 XXX XXX XXX
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
    setForm({ ...form, telefono: formatted });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div
        className={`w-full max-w-md relative z-10 transition-all duration-300 ${shake ? "animate-shake" : ""}`}
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform duration-300">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">
            N.S.O. System
          </h1>
          <p className="text-blue-200/80 text-sm font-medium tracking-wide uppercase">
            Nina Sandra Onewe System
          </p>
        </div>

        {/* Card Principal */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          {/* Progress Bar */}
          <div className="flex h-1 bg-white/10">
            <div
              className={`h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ${step === 1 ? "w-1/2" : "w-full"}`}
            />
          </div>

          <div className="p-8">
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  step === 1
                    ? "bg-blue-500 text-white"
                    : "bg-white/10 text-blue-200"
                }`}
              >
                <Phone className="w-3 h-3" />
                <span>Teléfono</span>
              </div>
              <div className="w-8 h-px bg-white/20" />
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  step === 2
                    ? "bg-green-500 text-white"
                    : "bg-white/10 text-blue-200"
                }`}
              >
                <Key className="w-3 h-3" />
                <span>Verificación</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {step === 1 ? (
                <>
                  {/* Input Teléfono */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider ml-1">
                      Número de Teléfono
                    </label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300 group-focus-within:text-blue-400 transition-colors" />
                      <input
                        type="tel"
                        name="telefono"
                        placeholder="+240 123 456 789"
                        value={form.telefono}
                        onChange={handlePhoneChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        required
                        disabled={loading}
                      />
                    </div>
                    <p className="text-xs text-blue-300/60 ml-1">
                      Incluye el código de país (+240)
                    </p>
                  </div>

                  {/* Selector de Rol */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider ml-1">
                      Tipo de Usuario
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(roleLabels).map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setForm({ ...form, rol: key })}
                          disabled={loading}
                          className={`flex items-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
                            form.rol === key
                              ? "bg-blue-500/20 border-blue-500/50 text-white shadow-lg shadow-blue-500/20"
                              : "bg-white/5 border-white/10 text-blue-200 hover:bg-white/10"
                          }`}
                        >
                          {roleIcons[key]}
                          <span className="text-sm font-medium">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Botón Submit */}
                  <button
                    type="submit"
                    disabled={
                      !form.telefono.replace(/\D/g, "").length > 3 || loading
                    }
                    className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-4 rounded-xl font-semibold shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          Enviar Código
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </button>
                </>
              ) : (
                <>
                  {/* Input OTP */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider ml-1">
                      Código de Verificación
                    </label>
                    <div className="relative group">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-300 group-focus-within:text-green-400 transition-colors" />
                      <input
                        ref={otpRef}
                        type="text"
                        name="otp"
                        placeholder="000000"
                        value={form.otp}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-center text-2xl tracking-[0.5em] font-mono placeholder-blue-300/30 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                        required
                        disabled={loading}
                        maxLength={6}
                        inputMode="numeric"
                      />
                    </div>
                    <p className="text-xs text-blue-300/60 ml-1 text-center">
                      Ingresa el código de 6 dígitos enviado a {form.telefono}
                    </p>
                  </div>

                  {/* Botón Verificar */}
                  <button
                    type="submit"
                    disabled={form.otp.length < 6 || loading}
                    className="w-full group relative overflow-hidden bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white py-4 rounded-xl font-semibold shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Verificando...
                        </>
                      ) : (
                        <>
                          Verificar e Ingresar
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </button>

                  {/* Botón Volver */}
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setForm({ ...form, otp: "" });
                    }}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 text-sm text-blue-300 hover:text-white transition-colors disabled:opacity-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Cambiar número de teléfono
                  </button>
                </>
              )}
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-blue-300/40 text-xs mt-6">
          Sistema seguro de autenticación • N.S.O. System © 2024
        </p>
      </div>

      {/* Animación shake personalizada */}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Login;
