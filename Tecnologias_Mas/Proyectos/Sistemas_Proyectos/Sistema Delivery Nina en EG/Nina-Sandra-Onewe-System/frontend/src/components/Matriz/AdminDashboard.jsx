// components/Matriz/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import {
  Store,
  Plane,
  Users,
  BarChart3,
  X,
  Search,
  ChevronDown,
  ChevronUp,
  MapPin,
  QrCode,
  Save,
  Camera,
  Plus,
} from "lucide-react";
import { Scanner } from "@yudiel/react-qr-scanner";

// Fix para iconos de Leaflet en React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Iconos personalizados
const abaceriaIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const agenciaIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const AdminDashboard = () => {
  const [abacerias, setAbacerias] = useState([]);
  const [agencias, setAgencias] = useState([]);
  const [formType, setFormType] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    barrio: "",
    lat: "",
    long: "",
    paises: "",
    qrCode: "",
  });
  const [searchAbacerias, setSearchAbacerias] = useState("");
  const [searchAgencias, setSearchAgencias] = useState("");
  const [openAbacerias, setOpenAbacerias] = useState(true);
  const [openAgencias, setOpenAgencias] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [stats, setStats] = useState({ abacerias: 0, agencias: 0, total: 0 });
  const center = [3.756, 8.781];

  useEffect(() => {
    fetchAbacerias();
    fetchAgencias();
  }, []);

  useEffect(() => {
    setStats({
      abacerias: abacerias.length,
      agencias: agencias.length,
      total: abacerias.length + agencias.length,
    });
  }, [abacerias, agencias]);

  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => setToast({ message: "", type: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchAbacerias = async () => {
    try {
      const res = await axios.get("/api/abacerias", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAbacerias(res.data || []);
    } catch (err) {
      console.error("Error fetching abacerías:", err);
    }
  };

  const fetchAgencias = async () => {
    try {
      const res = await axios.get("/api/agencias", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAgencias(res.data || []);
    } catch (err) {
      console.error("Error fetching agencias:", err);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (formType === "agencia") {
        try {
          payload.paises_cubiertos = JSON.parse(form.paises || "[]");
        } catch {
          showToast(
            'Formato de países inválido. Usa: ["España", "China"]',
            "error",
          );
          return;
        }
      }
      await axios.post(`/api/${formType}s`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      showToast(
        `${formType === "abaceria" ? "Abacería" : "Agencia"} creada exitosamente`,
        "success",
      );
      if (formType === "abaceria") fetchAbacerias();
      else fetchAgencias();
      resetForm();
    } catch (err) {
      showToast(
        "Error al crear: " + (err.response?.data?.error || err.message),
        "error",
      );
    }
  };

  const resetForm = () => {
    setForm({
      nombre: "",
      barrio: "",
      lat: "",
      long: "",
      paises: "",
      qrCode: "",
    });
    setFormType(null);
    setShowScanner(false);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleScanSuccess = (result) => {
    const scannedValue = result?.[0]?.rawValue || result;
    setForm((prev) => ({ ...prev, qrCode: scannedValue }));
    showToast(`QR escaneado: ${scannedValue}`, "success");
    setShowScanner(false);
  };

  const handleScanError = (err) => {
    console.warn("Error en escáner:", err);
  };

  const filteredAbacerias = abacerias.filter((a) =>
    `${a.nombre} ${a.barrio}`
      .toLowerCase()
      .includes(searchAbacerias.toLowerCase()),
  );

  const filteredAgencias = agencias.filter((a) =>
    `${a.nombre} ${a.barrio} ${a.paises_cubiertos?.join(" ") || ""}`
      .toLowerCase()
      .includes(searchAgencias.toLowerCase()),
  );

  // Estilos inline para asegurar que se apliquen
  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
    header: {
      backgroundColor: "white",
      borderBottom: "1px solid #e2e8f0",
      position: "sticky",
      top: 0,
      zIndex: 40,
    },
    headerContent: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "0 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: "64px",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    logoIcon: {
      width: "40px",
      height: "40px",
      background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
    },
    main: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "32px 24px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "16px",
      marginBottom: "32px",
    },
    card: {
      backgroundColor: "white",
      borderRadius: "16px",
      padding: "24px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    actionGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px",
      marginBottom: "32px",
    },
    actionCard: (color, disabled) => ({
      position: "relative",
      overflow: "hidden",
      borderRadius: "16px",
      padding: "24px",
      textAlign: "left",
      border: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      background: disabled ? "#f1f5f9" : `linear-gradient(135deg, ${color})`,
      color: disabled ? "#475569" : "white",
      transition: "all 0.3s",
      boxShadow: disabled ? "none" : "0 10px 15px -3px rgba(0,0,0,0.1)",
    }),
    modal: {
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      backdropFilter: "blur(4px)",
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
    },
    modalContent: {
      backgroundColor: "white",
      borderRadius: "24px",
      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
      width: "100%",
      maxWidth: "640px",
      maxHeight: "90vh",
      overflow: "auto",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      backgroundColor: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      fontSize: "16px",
      outline: "none",
      transition: "all 0.2s",
    },
    button: {
      width: "100%",
      padding: "16px",
      borderRadius: "12px",
      border: "none",
      fontSize: "16px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    listContainer: {
      backgroundColor: "white",
      borderRadius: "16px",
      border: "1px solid #e2e8f0",
      overflow: "hidden",
    },
    mapContainer: {
      backgroundColor: "white",
      borderRadius: "16px",
      border: "1px solid #e2e8f0",
      overflow: "hidden",
      height: "500px",
    },
    toast: {
      position: "fixed",
      bottom: "24px",
      right: "24px",
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "16px 24px",
      borderRadius: "16px",
      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
      animation: "slideIn 0.3s ease-out",
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <Store color="white" size={24} />
            </div>
            <div>
              <h1
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Panel de Administración
              </h1>
              <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
                N.S.O. System
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                padding: "8px 16px",
                backgroundColor: "#f1f5f9",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#475569",
              }}
            >
              Total: <strong>{stats.total}</strong>
            </div>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {/* Stats */}
        <div style={styles.grid}>
          <StatCard
            label="Abacerías"
            value={stats.abacerias}
            icon={Store}
            color={["#3b82f6", "#2563eb"]}
          />
          <StatCard
            label="Agencias"
            value={stats.agencias}
            icon={Plane}
            color={["#10b981", "#059669"]}
          />
          <StatCard
            label="Usuarios"
            value="—"
            icon={Users}
            color={["#8b5cf6", "#7c3aed"]}
          />
          <StatCard
            label="Pedidos Hoy"
            value="—"
            icon={BarChart3}
            color={["#f59e0b", "#d97706"]}
          />
        </div>

        {/* Action Cards */}
        <div style={styles.actionGrid}>
          <button
            onClick={() => setFormType("abaceria")}
            style={styles.actionCard(["#3b82f6", "#2563eb"])}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 20px 25px -5px rgba(59, 130, 246, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 10px 15px -3px rgba(0,0,0,0.1)";
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <Store size={24} color="white" />
            </div>
            <h3
              style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 4px 0" }}
            >
              Crear Abacería
            </h3>
            <p style={{ fontSize: "14px", opacity: 0.9, margin: 0 }}>
              Punto de recogida local
            </p>
          </button>

          <button
            onClick={() => setFormType("agencia")}
            style={styles.actionCard(["#10b981", "#059669"])}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 20px 25px -5px rgba(16, 185, 129, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 10px 15px -3px rgba(0,0,0,0.1)";
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <Plane size={24} color="white" />
            </div>
            <h3
              style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 4px 0" }}
            >
              Crear Agencia
            </h3>
            <p style={{ fontSize: "14px", opacity: 0.9, margin: 0 }}>
              Envíos internacionales
            </p>
          </button>

          <button
            disabled
            style={styles.actionCard(["#8b5cf6", "#7c3aed"], true)}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#e2e8f0",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <Users size={24} color="#94a3b8" />
            </div>
            <h3
              style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 4px 0" }}
            >
              Usuarios
            </h3>
            <p style={{ fontSize: "14px", margin: 0 }}>Próximamente</p>
          </button>

          <button
            disabled
            style={styles.actionCard(["#f59e0b", "#d97706"], true)}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#e2e8f0",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <BarChart3 size={24} color="#94a3b8" />
            </div>
            <h3
              style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 4px 0" }}
            >
              Reportes
            </h3>
            <p style={{ fontSize: "14px", margin: 0 }}>Próximamente</p>
          </button>
        </div>

        {/* Modal Form */}
        {formType && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <div
                style={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "white",
                  borderBottom: "1px solid #e2e8f0",
                  padding: "24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  zIndex: 10,
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "12px",
                      backgroundColor:
                        formType === "abaceria" ? "#dbeafe" : "#d1fae5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {formType === "abaceria" ? (
                      <Store color="#2563eb" size={20} />
                    ) : (
                      <Plane color="#059669" size={20} />
                    )}
                  </div>
                  <div>
                    <h2
                      style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        margin: 0,
                        color: "#0f172a",
                      }}
                    >
                      {formType === "abaceria"
                        ? "Nueva Abacería"
                        : "Nueva Agencia"}
                    </h2>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#64748b",
                        margin: "4px 0 0 0",
                      }}
                    >
                      Completa los datos requeridos
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetForm}
                  style={{
                    padding: "8px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                  }}
                >
                  <X size={24} color="#94a3b8" />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: "8px",
                      }}
                    >
                      Nombre *
                    </label>
                    <input
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Ej: Abacería Central"
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: "8px",
                      }}
                    >
                      Barrio *
                    </label>
                    <input
                      name="barrio"
                      value={form.barrio}
                      onChange={handleChange}
                      required
                      placeholder="Ej: Malabo Centro"
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: "8px",
                      }}
                    >
                      Latitud *
                    </label>
                    <input
                      name="lat"
                      type="number"
                      step="any"
                      value={form.lat}
                      onChange={handleChange}
                      required
                      placeholder="3.756"
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: "8px",
                      }}
                    >
                      Longitud *
                    </label>
                    <input
                      name="long"
                      type="number"
                      step="any"
                      value={form.long}
                      onChange={handleChange}
                      required
                      placeholder="8.781"
                      style={styles.input}
                    />
                  </div>
                </div>

                {formType === "agencia" && (
                  <div style={{ marginBottom: "20px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: "8px",
                      }}
                    >
                      Países cubiertos *
                    </label>
                    <input
                      name="paises"
                      value={form.paises}
                      onChange={handleChange}
                      required
                      placeholder='["España", "China", "Estados Unidos"]'
                      style={styles.input}
                    />
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        marginTop: "4px",
                      }}
                    >
                      Formato JSON array
                    </p>
                  </div>
                )}

                {formType === "abaceria" && (
                  <div style={{ marginBottom: "20px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: "8px",
                      }}
                    >
                      Código QR
                    </label>
                    <input
                      name="qrCode"
                      value={form.qrCode}
                      onChange={handleChange}
                      placeholder="Escanea o escribe manualmente"
                      style={styles.input}
                    />

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "16px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setShowScanner(!showScanner)}
                        style={{
                          ...styles.button,
                          width: "auto",
                          padding: "12px 24px",
                          backgroundColor: showScanner ? "#e5e7eb" : "#4f46e5",
                          color: showScanner ? "#374151" : "white",
                        }}
                      >
                        <Camera size={20} />
                        {showScanner ? "Ocultar Escáner" : "Escanear QR"}
                      </button>
                    </div>

                    {showScanner && (
                      <div
                        style={{
                          marginTop: "16px",
                          padding: "16px",
                          backgroundColor: "#f8fafc",
                          borderRadius: "12px",
                        }}
                      >
                        <div style={{ maxWidth: "400px", margin: "0 auto" }}>
                          <Scanner
                            onScan={handleScanSuccess}
                            onError={handleScanError}
                            components={{ finder: true }}
                            styles={{
                              container: {
                                borderRadius: "12px",
                                overflow: "hidden",
                              },
                              video: { borderRadius: "12px" },
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    paddingTop: "20px",
                    borderTop: "1px solid #e5e7eb",
                  }}
                >
                  <button
                    type="button"
                    onClick={resetForm}
                    style={{
                      ...styles.button,
                      flex: 1,
                      backgroundColor: "white",
                      color: "#374151",
                      border: "1px solid #d1d5db",
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    style={{
                      ...styles.button,
                      flex: 1,
                      backgroundColor:
                        formType === "abaceria" ? "#2563eb" : "#059669",
                      color: "white",
                    }}
                  >
                    <Save size={20} />
                    Guardar {formType === "abaceria" ? "Abacería" : "Agencia"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lists */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          {/* Abacerías List */}
          <div style={styles.listContainer}>
            <button
              onClick={() => setOpenAbacerias(!openAbacerias)}
              style={{
                width: "100%",
                padding: "20px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                borderBottom: openAbacerias ? "1px solid #e2e8f0" : "none",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#0f172a",
                    margin: 0,
                  }}
                >
                  Abacerías
                </h3>
                <span
                  style={{
                    padding: "4px 12px",
                    backgroundColor: "#f1f5f9",
                    color: "#475569",
                    borderRadius: "9999px",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  {filteredAbacerias.length}
                </span>
              </div>
              {openAbacerias ? (
                <ChevronUp size={24} color="#94a3b8" />
              ) : (
                <ChevronDown size={24} color="#94a3b8" />
              )}
            </button>

            {openAbacerias && (
              <div style={{ padding: "20px 24px" }}>
                <div style={{ position: "relative", marginBottom: "16px" }}>
                  <Search
                    size={20}
                    color="#94a3b8"
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Buscar abacería..."
                    value={searchAbacerias}
                    onChange={(e) => setSearchAbacerias(e.target.value)}
                    style={{ ...styles.input, paddingLeft: "40px" }}
                  />
                </div>

                <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                  {filteredAbacerias.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#94a3b8",
                      }}
                    >
                      <Store
                        size={48}
                        color="#cbd5e1"
                        style={{ margin: "0 auto 16px" }}
                      />
                      <p>No hay abacerías registradas</p>
                    </div>
                  ) : (
                    filteredAbacerias.map((a) => (
                      <div
                        key={a.id}
                        style={{
                          padding: "16px",
                          backgroundColor: "#f8fafc",
                          borderRadius: "12px",
                          marginBottom: "12px",
                          border: "1px solid #f1f5f9",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: "#dbeafe",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Store size={20} color="#2563eb" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4
                            style={{
                              fontSize: "16px",
                              fontWeight: 600,
                              color: "#0f172a",
                              margin: "0 0 4px 0",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {a.nombre}
                          </h4>
                          <p
                            style={{
                              fontSize: "14px",
                              color: "#64748b",
                              margin: "0 0 4px 0",
                            }}
                          >
                            {a.barrio}
                          </p>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#94a3b8",
                              margin: 0,
                              fontFamily: "monospace",
                            }}
                          >
                            {a.lat?.toFixed(4)}, {a.long?.toFixed(4)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Agencias List */}
          <div style={styles.listContainer}>
            <button
              onClick={() => setOpenAgencias(!openAgencias)}
              style={{
                width: "100%",
                padding: "20px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                borderBottom: openAgencias ? "1px solid #e2e8f0" : "none",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#0f172a",
                    margin: 0,
                  }}
                >
                  Agencias
                </h3>
                <span
                  style={{
                    padding: "4px 12px",
                    backgroundColor: "#f1f5f9",
                    color: "#475569",
                    borderRadius: "9999px",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  {filteredAgencias.length}
                </span>
              </div>
              {openAgencias ? (
                <ChevronUp size={24} color="#94a3b8" />
              ) : (
                <ChevronDown size={24} color="#94a3b8" />
              )}
            </button>

            {openAgencias && (
              <div style={{ padding: "20px 24px" }}>
                <div style={{ position: "relative", marginBottom: "16px" }}>
                  <Search
                    size={20}
                    color="#94a3b8"
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Buscar agencia..."
                    value={searchAgencias}
                    onChange={(e) => setSearchAgencias(e.target.value)}
                    style={{ ...styles.input, paddingLeft: "40px" }}
                  />
                </div>

                <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                  {filteredAgencias.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#94a3b8",
                      }}
                    >
                      <Plane
                        size={48}
                        color="#cbd5e1"
                        style={{ margin: "0 auto 16px" }}
                      />
                      <p>No hay agencias registradas</p>
                    </div>
                  ) : (
                    filteredAgencias.map((a) => (
                      <div
                        key={a.id}
                        style={{
                          padding: "16px",
                          backgroundColor: "#f8fafc",
                          borderRadius: "12px",
                          marginBottom: "12px",
                          border: "1px solid #f1f5f9",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: "#d1fae5",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Plane size={20} color="#059669" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4
                            style={{
                              fontSize: "16px",
                              fontWeight: 600,
                              color: "#0f172a",
                              margin: "0 0 4px 0",
                            }}
                          >
                            {a.nombre}
                          </h4>
                          <p
                            style={{
                              fontSize: "14px",
                              color: "#64748b",
                              margin: "0 0 8px 0",
                            }}
                          >
                            {a.barrio}
                          </p>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "4px",
                            }}
                          >
                            {a.paises_cubiertos?.slice(0, 3).map((pais, i) => (
                              <span
                                key={i}
                                style={{
                                  fontSize: "11px",
                                  padding: "4px 8px",
                                  backgroundColor: "#d1fae5",
                                  color: "#059669",
                                  borderRadius: "9999px",
                                  fontWeight: 500,
                                }}
                              >
                                {pais}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div style={styles.mapContainer}>
          <button
            onClick={() => setShowMap(!showMap)}
            style={{
              width: "100%",
              padding: "20px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              borderBottom: showMap ? "1px solid #e2e8f0" : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#ede9fe",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MapPin size={20} color="#7c3aed" />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#0f172a",
                    margin: 0,
                  }}
                >
                  Mapa de Ubicaciones
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#64748b",
                    margin: "4px 0 0 0",
                  }}
                >
                  Vista geográfica de todas las entidades
                </p>
              </div>
            </div>
            {showMap ? (
              <ChevronUp size={24} color="#94a3b8" />
            ) : (
              <ChevronDown size={24} color="#94a3b8" />
            )}
          </button>

          {showMap && (
            <div style={{ height: "400px", position: "relative" }}>
              <MapContainer
                center={center}
                zoom={10}
                style={{ height: "100%", width: "100%" }}
              >
                <LayersControl position="topright">
                  <LayersControl.BaseLayer checked name="Estándar">
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap"
                    />
                  </LayersControl.BaseLayer>
                  <LayersControl.BaseLayer name="Satélite">
                    <TileLayer
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                      attribution="Tiles &copy; Esri"
                    />
                  </LayersControl.BaseLayer>
                </LayersControl>

                {abacerias.map((a) => (
                  <Marker
                    key={`ab-${a.id}`}
                    position={[a.lat, a.long]}
                    icon={abaceriaIcon}
                  >
                    <Popup>
                      <div style={{ padding: "8px" }}>
                        <strong style={{ color: "#2563eb" }}>{a.nombre}</strong>
                        <p style={{ margin: "4px 0", fontSize: "14px" }}>
                          {a.barrio}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {agencias.map((a) => (
                  <Marker
                    key={`ag-${a.id}`}
                    position={[a.lat, a.long]}
                    icon={agenciaIcon}
                  >
                    <Popup>
                      <div style={{ padding: "8px" }}>
                        <strong style={{ color: "#059669" }}>{a.nombre}</strong>
                        <p style={{ margin: "4px 0", fontSize: "14px" }}>
                          {a.barrio}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              {/* Leyenda */}
              <div
                style={{
                  position: "absolute",
                  bottom: "16px",
                  left: "16px",
                  backgroundColor: "rgba(255,255,255,0.95)",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  zIndex: 400,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: "#3b82f6",
                      borderRadius: "50%",
                    }}
                  />
                  <span style={{ fontSize: "14px", color: "#374151" }}>
                    Abacería
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: "#10b981",
                      borderRadius: "50%",
                    }}
                  />
                  <span style={{ fontSize: "14px", color: "#374151" }}>
                    Agencia
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Toast */}
      {toast.message && (
        <div
          style={{
            ...styles.toast,
            backgroundColor: toast.type === "success" ? "#059669" : "#dc2626",
            color: "white",
          }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {toast.type === "success" ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            )}
          </div>
          <span style={{ fontWeight: 500 }}>{toast.message}</span>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .leaflet-container {
          font-family: system-ui, -apple-system, sans-serif;
        }
      `}</style>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div
    style={{
      backgroundColor: "white",
      borderRadius: "16px",
      padding: "24px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
    }}
  >
    <div>
      <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 8px 0" }}>
        {label}
      </p>
      <p
        style={{
          fontSize: "28px",
          fontWeight: 700,
          color: "#0f172a",
          margin: 0,
        }}
      >
        {value}
      </p>
    </div>
    <div
      style={{
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        background: `linear-gradient(135deg, ${color[0]}, ${color[1]})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 10px 15px -3px ${color[0]}40`,
      }}
    >
      <Icon size={24} color="white" />
    </div>
  </div>
);

export default AdminDashboard;
