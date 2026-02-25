// components/Agencia/SeleccionAbaceria.jsx
import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  LayersControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";

// Fix para iconos de Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Iconos SVG como strings
const NavigationIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: "#2563eb" }}
  >
    <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
  </svg>
);

const PackageIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: "#64748b" }}
  >
    <path d="m21 16-9.05-4.73a2 2 0 0 0-1.9 0L2 16"></path>
    <path d="m16.5 15.5 6.5-3.5-6.5-3.5-6.5 3.5 6.5 3.5Z"></path>
    <path d="m2 16 6.5 3.5"></path>
    <path d="m21 16-6.5 3.5"></path>
    <path d="m12 2v6.5l6.5 3.5"></path>
    <path d="m12 12 6.5-3.5"></path>
  </svg>
);

const RouteIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: "#64748b" }}
  >
    <circle cx="6" cy="19" r="3"></circle>
    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"></path>
    <circle cx="18" cy="5" r="3"></circle>
  </svg>
);

const MapPinIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: "#2563eb" }}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const AlertCircleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: "#d97706" }}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" x2="12" y1="8" y2="12"></line>
    <line x1="12" x2="12.01" y1="16" y2="16"></line>
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: "white" }}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const StoreIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: "#2563eb" }}
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const SatelliteIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: "#2563eb" }}
  >
    <path d="M13 7 9 3 5 7l4 4"></path>
    <path d="m17 11 4 4-4 4-4-4"></path>
    <path d="m8 12 4 4 6-6-4-4"></path>
    <path d="m16 8 3-3"></path>
    <path d="M9 21a6 6 0 0 0-6-6"></path>
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: "#9ca3af" }}
  >
    <path d="m6 9 6 6 6-6"></path>
  </svg>
);

const LoaderIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: "#2563eb", animation: "spin 1s linear infinite" }}
  >
    <line x1="12" x2="12" y1="2" y2="6"></line>
    <line x1="12" x2="12" y1="18" y2="22"></line>
    <line x1="4.93" x2="7.76" y1="4.93" y2="7.76"></line>
    <line x1="16.24" x2="19.07" y1="16.24" y2="19.07"></line>
    <line x1="2" x2="6" y1="12" y2="12"></line>
    <line x1="18" x2="22" y1="12" y2="12"></line>
    <line x1="4.93" x2="7.76" y1="19.07" y2="16.24"></line>
    <line x1="16.24" x2="19.07" y1="7.76" y2="4.93"></line>
  </svg>
);

// Iconos personalizados para el mapa
const pedidoIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div style="background-color: #ef4444; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const abaceriaIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div style="background-color: #3b82f6; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fef2f2",
            padding: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              padding: "32px",
              maxWidth: "400px",
              width: "100%",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                backgroundColor: "#fee2e2",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#dc2626"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" x2="12" y1="8" y2="12"></line>
                <line x1="12" x2="12.01" y1="16" y2="16"></line>
              </svg>
            </div>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#0f172a",
                marginBottom: "8px",
              }}
            >
              Error en el componente
            </h3>
            <p style={{ color: "#64748b", marginBottom: "24px" }}>
              {this.state.error?.message || "Ocurrió un error inesperado"}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#2563eb",
                color: "white",
                borderRadius: "12px",
                border: "none",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const SeleccionAbaceria = () => {
  const [abacerias, setAbacerias] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [selectedAbaceria, setSelectedAbaceria] = useState(null);
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [asignando, setAsignando] = useState(false);
  const center = [3.756, 8.781];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resAbac = await axios.get(
          `/api/abacerias?lat=${center[0]}&long=${center[1]}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        const abaceriasValidas = (resAbac.data || []).map((a) => ({
          ...a,
          distancia: a.distancia || 0,
          lat: a.lat || center[0],
          long: a.long || center[1],
          nombre: a.nombre || "Sin nombre",
          barrio: a.barrio || "Sin barrio",
          calificacion_agencia: a.calificacion_agencia || 0,
        }));

        setAbacerias(abaceriasValidas);

        try {
          const resPed = await axios.get("/api/pedidos?status=pending", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setPedidos(resPed.data || []);
        } catch (pedErr) {
          if (pedErr.response?.status === 404) {
            setPedidos([
              {
                id: 1,
                barrio: "Malabo Centro",
                codigo: "PIN123456",
                lat: 3.756,
                long: 8.781,
                productos: "Arroz 5kg x2",
              },
              {
                id: 2,
                barrio: "Bata Norte",
                codigo: "PIN789012",
                lat: 1.863,
                long: 9.772,
                productos: "Leche 1L x1",
              },
              {
                id: 3,
                barrio: "Luba Sur",
                codigo: "PIN345678",
                lat: 3.45,
                long: 8.5,
                productos: "Electrónicos China x1",
              },
              {
                id: 4,
                barrio: "Erundanga",
                codigo: "PIN901234",
                lat: 3.7,
                long: 8.7,
                productos: "Aceite 1L x1",
              },
            ]);
          } else {
            throw pedErr;
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error cargando datos. Verifica backend en 8080.");
        setAbacerias([]);
        setPedidos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSeleccionAbaceria = async (abaceria) => {
    if (!selectedPedido) {
      alert("Selecciona un pedido del dropdown primero.");
      return;
    }

    setAsignando(true);
    setSelectedAbaceria(abaceria);

    const ruta = [
      [selectedPedido.lat, selectedPedido.long],
      [abaceria.lat, abaceria.long],
    ];
    setRutas([...rutas, { positions: ruta, color: "#3b82f6", weight: 4 }]);

    try {
      await axios.patch(
        `/api/pedidos/${selectedPedido.id}/asignar`,
        { abaceria_id: abaceria.id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      alert(`¡Asignado! Pedido ${selectedPedido.codigo} a ${abaceria.nombre}`);
    } catch (err) {
      alert(
        "Error asignando: " + (err.response?.data?.error || "Intenta de nuevo"),
      );
    } finally {
      setAsignando(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8fafc",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <LoaderIcon />
          <p style={{ color: "#475569", fontWeight: 500 }}>
            Cargando mapa y datos...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fef2f2",
          padding: "16px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            padding: "32px",
            maxWidth: "400px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              backgroundColor: "#fee2e2",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#dc2626"
              strokeWidth="2"
              strokeLinecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" x2="12" y1="8" y2="12"></line>
              <line x1="12" x2="12.01" y1="16" y2="16"></line>
            </svg>
          </div>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: "8px",
            }}
          >
            Error
          </h3>
          <p style={{ color: "#64748b", marginBottom: "24px" }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#2563eb",
              color: "white",
              borderRadius: "12px",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Recargar página
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f8fafc",
          paddingBottom: "32px",
        }}
      >
        {/* Header */}
        <header
          style={{
            backgroundColor: "white",
            borderBottom: "1px solid #e2e8f0",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "0 16px",
              height: "64px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#dbeafe",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <NavigationIcon />
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
                  Asignación de Pedidos
                </h1>
                <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
                  Panel de Agencia
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                fontSize: "14px",
                color: "#475569",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 12px",
                  backgroundColor: "#f1f5f9",
                  borderRadius: "8px",
                }}
              >
                <PackageIcon />
                {pedidos.length} pedidos
              </span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 12px",
                  backgroundColor: "#f1f5f9",
                  borderRadius: "8px",
                }}
              >
                <RouteIcon />
                {rutas.length} rutas
              </span>
            </div>
          </div>
        </header>

        <main
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "24px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* Controls */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "24px",
              }}
            >
              {/* Selector de Pedido */}
              <div style={{ gridColumn: "span 2" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <PackageIcon />
                  Seleccionar Pedido Pendiente
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={selectedPedido ? selectedPedido.id : ""}
                    onChange={(e) => {
                      const pedido = pedidos.find(
                        (p) => p.id == e.target.value,
                      );
                      setSelectedPedido(pedido);
                      setRutas([]);
                      setSelectedAbaceria(null);
                    }}
                    style={{
                      width: "100%",
                      appearance: "none",
                      padding: "12px 16px",
                      paddingRight: "40px",
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      fontSize: "16px",
                      color: "#0f172a",
                      outline: "none",
                    }}
                  >
                    <option value="">Selecciona un pedido...</option>
                    {pedidos.map((p) => (
                      <option key={p.id} value={p.id}>
                        #{p.codigo} - {p.barrio} ({p.productos})
                      </option>
                    ))}
                  </select>
                  <div
                    style={{
                      position: "absolute",
                      right: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  >
                    <ChevronDownIcon />
                  </div>
                </div>
              </div>

              {/* Info del pedido seleccionado */}
              <div>
                {selectedPedido ? (
                  <div
                    style={{
                      backgroundColor: "#eff6ff",
                      border: "1px solid #bfdbfe",
                      borderRadius: "12px",
                      padding: "16px",
                    }}
                  >
                    <div
                      style={{
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
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <MapPinIcon />
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#0f172a",
                            margin: "0 0 4px 0",
                          }}
                        >
                          Pedido seleccionado
                        </p>
                        <p
                          style={{
                            fontSize: "18px",
                            fontWeight: 700,
                            color: "#2563eb",
                            margin: "0 0 4px 0",
                          }}
                        >
                          {selectedPedido.codigo}
                        </p>
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#475569",
                            margin: "0 0 4px 0",
                          }}
                        >
                          {selectedPedido.barrio}
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#6b7280",
                            margin: 0,
                          }}
                        >
                          {selectedPedido.productos}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      backgroundColor: "#fffbeb",
                      border: "1px solid #fcd34d",
                      borderRadius: "12px",
                      padding: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <AlertCircleIcon />
                    <p
                      style={{ fontSize: "14px", color: "#92400e", margin: 0 }}
                    >
                      Selecciona un pedido para ver las abacerías disponibles
                    </p>
                  </div>
                )}
              </div>
            </div>

            {selectedAbaceria && (
              <div
                style={{
                  marginTop: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px",
                  backgroundColor: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: "#10b981",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckCircleIcon />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#065f46",
                      margin: "0 0 4px 0",
                    }}
                  >
                    Abacería seleccionada: {selectedAbaceria.nombre}
                  </p>
                  <p style={{ fontSize: "14px", color: "#047857", margin: 0 }}>
                    Distancia: {(selectedAbaceria.distancia || 0).toFixed(0)}m
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Map */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 24px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <SatelliteIcon />
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#0f172a",
                    margin: 0,
                  }}
                >
                  Mapa de Ubicaciones
                </h2>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  fontSize: "14px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#ef4444",
                    }}
                  />
                  <span style={{ color: "#475569" }}>Pedido</span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#3b82f6",
                    }}
                  />
                  <span style={{ color: "#475569" }}>Abacería</span>
                </div>
              </div>
            </div>

            <div style={{ height: "500px", position: "relative" }}>
              <MapContainer
                center={center}
                zoom={10}
                style={{ height: "100%", width: "100%", zIndex: 0 }}
              >
                <LayersControl position="topright">
                  <LayersControl.BaseLayer checked name="Mapa Estándar">
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap"
                    />
                  </LayersControl.BaseLayer>
                  <LayersControl.BaseLayer name="Satélite">
                    <TileLayer
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                      attribution="&copy; Esri"
                    />
                  </LayersControl.BaseLayer>
                  <LayersControl.BaseLayer name="Terreno">
                    <TileLayer
                      url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenTopoMap"
                    />
                  </LayersControl.BaseLayer>
                </LayersControl>

                {/* Markers Abacerías */}
                {abacerias.map((a) => (
                  <Marker
                    key={a.id}
                    position={[a.lat, a.long]}
                    icon={abaceriaIcon}
                  >
                    <Popup>
                      <div style={{ padding: "8px", minWidth: "200px" }}>
                        <h3
                          style={{
                            fontWeight: 700,
                            color: "#0f172a",
                            marginBottom: "4px",
                          }}
                        >
                          {a.nombre}
                        </h3>
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#475569",
                            marginBottom: "4px",
                          }}
                        >
                          Barrio: {a.barrio}
                        </p>
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#475569",
                            marginBottom: "4px",
                          }}
                        >
                          Distancia: {(a.distancia || 0).toFixed(0)}m
                        </p>
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#475569",
                            marginBottom: "12px",
                          }}
                        >
                          Calificación: {a.calificacion_agencia || "N/A"}
                        </p>
                        <button
                          onClick={() => handleSeleccionAbaceria(a)}
                          disabled={!selectedPedido || asignando}
                          style={{
                            width: "100%",
                            padding: "8px",
                            backgroundColor:
                              !selectedPedido || asignando
                                ? "#9ca3af"
                                : "#2563eb",
                            color: "white",
                            borderRadius: "8px",
                            border: "none",
                            fontSize: "14px",
                            fontWeight: 600,
                            cursor:
                              !selectedPedido || asignando
                                ? "not-allowed"
                                : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                          }}
                        >
                          {asignando ? <LoaderIcon /> : <CheckCircleIcon />}
                          Asignar Pedido
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Marker Pedido */}
                {selectedPedido && (
                  <Marker
                    position={[selectedPedido.lat, selectedPedido.long]}
                    icon={pedidoIcon}
                  >
                    <Popup>
                      <div style={{ padding: "8px" }}>
                        <h3
                          style={{
                            fontWeight: 700,
                            color: "#0f172a",
                            marginBottom: "4px",
                          }}
                        >
                          Pedido {selectedPedido.codigo}
                        </h3>
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#475569",
                            marginBottom: "4px",
                          }}
                        >
                          Barrio: {selectedPedido.barrio}
                        </p>
                        <p style={{ fontSize: "14px", color: "#475569" }}>
                          {selectedPedido.productos}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                )}

                {/* Rutas */}
                {rutas.map((r, index) => (
                  <Polyline
                    key={index}
                    positions={r.positions}
                    color={r.color}
                    weight={r.weight}
                    opacity={0.8}
                  />
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Lista de Abacerías */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  margin: 0,
                }}
              >
                <StoreIcon />
                Abacerías Disponibles
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#6b7280",
                  }}
                >
                  ({abacerias.length} encontradas)
                </span>
              </h2>
            </div>

            {abacerias.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "12px",
                }}
              >
                <StoreIcon />
                <p style={{ color: "#6b7280", marginTop: "12px" }}>
                  No se encontraron abacerías cercanas
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#9ca3af",
                    marginTop: "4px",
                  }}
                >
                  Prueba cambiando la ubicación del pedido
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "16px",
                }}
              >
                {abacerias.map((a) => (
                  <div
                    key={a.id}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "16px",
                      backgroundColor: "white",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: "#dbeafe",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <StoreIcon />
                      </div>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#2563eb",
                          backgroundColor: "#eff6ff",
                          padding: "4px 12px",
                          borderRadius: "9999px",
                        }}
                      >
                        {(a.distancia || 0).toFixed(0)}m
                      </span>
                    </div>

                    <h3
                      style={{
                        fontWeight: 700,
                        color: "#0f172a",
                        marginBottom: "4px",
                      }}
                    >
                      {a.nombre}
                    </h3>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        marginBottom: "4px",
                      }}
                    >
                      {a.barrio}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#9ca3af",
                        marginBottom: "16px",
                      }}
                    >
                      Calificación:{" "}
                      {a.calificacion_agencia
                        ? "⭐".repeat(Math.round(a.calificacion_agencia))
                        : "N/A"}
                    </p>

                    <button
                      onClick={() => handleSeleccionAbaceria(a)}
                      disabled={!selectedPedido || asignando}
                      style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor:
                          !selectedPedido || asignando ? "#9ca3af" : "#059669",
                        color: "white",
                        borderRadius: "8px",
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor:
                          !selectedPedido || asignando
                            ? "not-allowed"
                            : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      {asignando && selectedAbaceria?.id === a.id ? (
                        <LoaderIcon />
                      ) : (
                        <CheckCircleIcon />
                      )}
                      Asignar Pedido
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </ErrorBoundary>
  );
};

export default SeleccionAbaceria;
