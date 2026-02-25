// components/Abaceria/ListaPedidos.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Package,
  CheckCircle,
  X,
  Search,
  Phone,
  Clock,
  AlertCircle,
  Loader2,
  MapPin,
} from "lucide-react";

const ListaPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [pinInput, setPinInput] = useState("");
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmando, setConfirmando] = useState(false);
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/pedidos/abaceria",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setPedidos(res.data || []);
      } catch (err) {
        console.error("Error fetching pedidos:", err);
        // Mock data para desarrollo
        setPedidos([
          {
            id: 1,
            cliente_telefono: "+240 1234567",
            codigo_pin: "PIN123",
            productos: "Arroz Premium 5kg x2, Aceite 1L x1, Azúcar 1kg",
            estado: "pendiente",
            cliente_nombre: "Juan Pérez",
            fecha: "2026-02-25",
            total: 6200,
          },
          {
            id: 2,
            cliente_telefono: "+240 7654321",
            codigo_pin: "PIN456",
            productos: "Leche Entera 1L x3, Pan fresco x2, Huevos docena",
            estado: "listo",
            cliente_nombre: "María García",
            fecha: "2026-02-25",
            total: 3400,
          },
          {
            id: 3,
            cliente_telefono: "+240 9876543",
            codigo_pin: "PIN789",
            productos: "Arroz, Frijoles, Pasta",
            estado: "recogido",
            cliente_nombre: "Carlos López",
            fecha: "2026-02-24",
            total: 15000,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

  // Confirmar por PIN o directamente desde modal
  const handleConfirmarPin = async (pedidoToConfirm = null) => {
    let pedido = pedidoToConfirm;

    if (!pedido) {
      if (!pinInput) return;
      pedido = pedidos.find((p) => p.codigo_pin === pinInput.toUpperCase());
    }

    if (!pedido) {
      alert("PIN no válido. Verifica con el cliente.");
      return;
    }
    if (pedido.estado === "recogido") {
      alert("Este pedido ya fue recogido.");
      setPinInput("");
      return;
    }

    setConfirmando(true);
    try {
      await axios.patch(
        `http://localhost:8080/api/pedidos/${pedido.id}/confirmar`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setPedidos(
        pedidos.map((p) =>
          p.id === pedido.id ? { ...p, estado: "recogido" } : p,
        ),
      );
      setPinInput("");
      alert("¡Pedido confirmado exitosamente! ✅");
      setSelectedPedido(null);
    } catch (err) {
      alert(
        "Error al confirmar: " +
          (err.response?.data?.error || "Intenta de nuevo"),
      );
    } finally {
      setConfirmando(false);
    }
  };

  const getStatusColor = (estado) => {
    const colors = {
      pendiente: {
        bg: "#fffbeb",
        border: "#fcd34d",
        text: "#92400e",
        dot: "#f59e0b",
      },
      listo: {
        bg: "#ecfdf5",
        border: "#a7f3d0",
        text: "#065f46",
        dot: "#10b981",
      },
      recogido: {
        bg: "#eff6ff",
        border: "#bfdbfe",
        text: "#1e40af",
        dot: "#3b82f6",
      },
    };
    return colors[estado] || colors.pendiente;
  };

  const getStatusLabel = (estado) => {
    const labels = {
      pendiente: "Pendiente",
      listo: "Listo para recoger",
      recogido: "Recogido",
    };
    return labels[estado] || estado;
  };

  const pedidosFiltrados = pedidos.filter((p) =>
    filtro === "todos" ? true : p.estado === filtro,
  );

  const stats = {
    total: pedidos.length,
    pendientes: pedidos.filter((p) => p.estado === "pendiente").length,
    listos: pedidos.filter((p) => p.estado === "listo").length,
    recogidos: pedidos.filter((p) => p.estado === "recogido").length,
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
          <Loader2
            style={{
              width: "40px",
              height: "40px",
              color: "#3b82f6",
              animation: "spin 1s linear infinite",
            }}
          />
          <p style={{ color: "#475569", fontWeight: 500 }}>
            Cargando pedidos...
          </p>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
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
          zIndex: 20,
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                backgroundColor: "#dbeafe",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Package
                style={{ width: "24px", height: "24px", color: "#3b82f6" }}
              />
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
                Panel de Abacería
              </h1>
              <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
                Gestión de pedidos
              </p>
            </div>
          </div>
          <div style={{ fontSize: "13px", color: "#64748b" }}>
            {new Date().toLocaleDateString("es-ES")}
          </div>
        </div>
      </header>

      <main
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "16px",
              border: "1px solid #e2e8f0",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: "#f59e0b",
                margin: "0 0 4px 0",
              }}
            >
              {stats.pendientes}
            </p>
            <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
              Pendientes
            </p>
          </div>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "16px",
              border: "1px solid #e2e8f0",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: "#10b981",
                margin: "0 0 4px 0",
              }}
            >
              {stats.listos}
            </p>
            <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
              Listos
            </p>
          </div>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "16px",
              border: "1px solid #e2e8f0",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: "#3b82f6",
                margin: "0 0 4px 0",
              }}
            >
              {stats.recogidos}
            </p>
            <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
              Recogidos
            </p>
          </div>
        </div>

        {/* Verificar PIN */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 16px 0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Search
              style={{ width: "20px", height: "20px", color: "#3b82f6" }}
            />
            Verificar PIN de Cliente
          </h2>

          <div style={{ position: "relative", marginBottom: "12px" }}>
            <input
              type="text"
              placeholder="Ingresa PIN (ej: PIN123)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === "Enter" && handleConfirmarPin()}
              style={{
                width: "100%",
                padding: "16px",
                paddingLeft: "48px",
                backgroundColor: "#f8fafc",
                border: "2px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "18px",
                fontFamily: "monospace",
                letterSpacing: "0.15em",
                textAlign: "center",
                textTransform: "uppercase",
                outline: "none",
              }}
              maxLength={10}
            />
            <div
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <Search
                style={{ width: "20px", height: "20px", color: "#9ca3af" }}
              />
            </div>
          </div>

          <button
            onClick={() => handleConfirmarPin()}
            disabled={!pinInput || confirmando}
            style={{
              width: "100%",
              padding: "16px",
              backgroundColor: pinInput && !confirmando ? "#10b981" : "#e2e8f0",
              color: pinInput && !confirmando ? "white" : "#94a3b8",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: pinInput && !confirmando ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {confirmando ? (
              <>
                <Loader2
                  style={{
                    width: "20px",
                    height: "20px",
                    animation: "spin 1s linear infinite",
                  }}
                />
                Confirmando...
              </>
            ) : (
              <>
                <CheckCircle style={{ width: "20px", height: "20px" }} />
                Confirmar Recogida
              </>
            )}
          </button>
        </div>

        {/* Filtros */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            paddingBottom: "4px",
          }}
        >
          {[
            { value: "todos", label: "Todos" },
            { value: "pendiente", label: "Pendientes" },
            { value: "listo", label: "Listos" },
            { value: "recogido", label: "Recogidos" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFiltro(tab.value)}
              style={{
                padding: "8px 20px",
                borderRadius: "9999px",
                border: "none",
                backgroundColor: filtro === tab.value ? "#3b82f6" : "white",
                color: filtro === tab.value ? "white" : "#64748b",
                fontSize: "14px",
                fontWeight: 500,
                whiteSpace: "nowrap",
                boxShadow:
                  filtro === tab.value
                    ? "0 1px 3px rgba(59,130,246,0.3)"
                    : "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              {tab.label}
              {tab.value !== "todos" && (
                <span
                  style={{ marginLeft: "6px", fontSize: "12px", opacity: 0.8 }}
                >
                  (
                  {
                    stats[
                      tab.value === "pendiente" ? "pendientes" : tab.value + "s"
                    ]
                  }
                  )
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Lista */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#0f172a" }}>
              Pedidos {filtro !== "todos" && `(${getStatusLabel(filtro)})`}
            </h2>
            <span style={{ fontSize: "13px", color: "#64748b" }}>
              {pedidosFiltrados.length} pedidos
            </span>
          </div>

          {pedidosFiltrados.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#94a3b8",
              }}
            >
              <AlertCircle
                style={{ width: "48px", height: "48px", margin: "0 auto 16px" }}
              />
              <p>No hay pedidos en esta categoría</p>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {pedidosFiltrados.map((pedido) => {
                const status = getStatusColor(pedido.estado);
                return (
                  <div
                    key={pedido.id}
                    onClick={() => setSelectedPedido(pedido)}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "16px",
                      padding: "20px",
                      border: `1px solid ${status.border}`,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "12px",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontWeight: 600,
                            color: "#0f172a",
                            margin: "0 0 4px 0",
                          }}
                        >
                          {pedido.cliente_nombre}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            color: "#64748b",
                            fontSize: "14px",
                          }}
                        >
                          <Phone style={{ width: "16px", height: "16px" }} />
                          {pedido.cliente_telefono}
                        </div>
                      </div>

                      <div
                        style={{
                          padding: "4px 12px",
                          borderRadius: "9999px",
                          fontSize: "12px",
                          fontWeight: 600,
                          backgroundColor: status.bg,
                          color: status.text,
                          border: `1px solid ${status.border}`,
                        }}
                      >
                        {getStatusLabel(pedido.estado)}
                      </div>
                    </div>

                    <div
                      style={{
                        backgroundColor: "#f8fafc",
                        padding: "12px",
                        borderRadius: "12px",
                        marginBottom: "12px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#334155",
                          lineHeight: "1.4",
                        }}
                      >
                        {pedido.productos}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "14px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          color: "#64748b",
                        }}
                      >
                        <Clock style={{ width: "16px", height: "16px" }} />
                        {pedido.fecha}
                      </div>
                      <div style={{ fontWeight: 700, color: "#0f172a" }}>
                        {pedido.total.toLocaleString()} XAF
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: "12px",
                        paddingTop: "12px",
                        borderTop: "1px solid #f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "#3b82f6",
                        fontSize: "13px",
                        fontWeight: 500,
                      }}
                    >
                      <MapPin style={{ width: "16px", height: "16px" }} />
                      PIN:{" "}
                      <span
                        style={{
                          fontFamily: "monospace",
                          letterSpacing: "1px",
                        }}
                      >
                        {pedido.codigo_pin}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modal Detalles */}
      {selectedPedido && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setSelectedPedido(null)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              maxWidth: "480px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "24px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p style={{ fontSize: "13px", color: "#64748b" }}>Pedido</p>
                <h3
                  style={{
                    margin: 0,
                    fontFamily: "monospace",
                    letterSpacing: "2px",
                    fontSize: "22px",
                  }}
                >
                  {selectedPedido.codigo_pin}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPedido(null)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "8px",
                  cursor: "pointer",
                }}
              >
                <X size={24} color="#64748b" />
              </button>
            </div>

            <div style={{ padding: "24px" }}>
              <div style={{ marginBottom: "24px" }}>
                <p
                  style={{
                    color: "#475569",
                    fontWeight: 500,
                    marginBottom: "8px",
                  }}
                >
                  Cliente
                </p>
                <p style={{ fontSize: "18px", fontWeight: 600 }}>
                  {selectedPedido.cliente_nombre}
                </p>
                <p style={{ color: "#64748b" }}>
                  {selectedPedido.cliente_telefono}
                </p>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <p
                  style={{
                    color: "#475569",
                    fontWeight: 500,
                    marginBottom: "8px",
                  }}
                >
                  Productos
                </p>
                <p style={{ lineHeight: "1.6", color: "#334155" }}>
                  {selectedPedido.productos}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "16px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "12px",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <p style={{ color: "#64748b", fontSize: "13px" }}>Total</p>
                  <p style={{ fontSize: "22px", fontWeight: 700 }}>
                    {selectedPedido.total.toLocaleString()} XAF
                  </p>
                </div>
                <div>
                  <p style={{ color: "#64748b", fontSize: "13px" }}>Fecha</p>
                  <p>{selectedPedido.fecha}</p>
                </div>
              </div>

              {selectedPedido.estado !== "recogido" && (
                <button
                  onClick={() => handleConfirmarPin(selectedPedido)}
                  style={{
                    width: "100%",
                    padding: "16px",
                    backgroundColor: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                >
                  Confirmar Recogida Ahora
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          textAlign: "center",
          marginTop: "40px",
          color: "#94a3b8",
          fontSize: "13px",
        }}
      >
        El cliente debe mostrarte el PIN desde su app
      </div>
    </div>
  );
};

export default ListaPedidos;
