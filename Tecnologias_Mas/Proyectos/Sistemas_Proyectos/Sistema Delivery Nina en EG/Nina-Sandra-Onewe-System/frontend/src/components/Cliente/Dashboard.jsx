// components/Cliente/DashboardCliente.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Package,
  ShoppingBag,
  MapPin,
  Clock,
  CheckCircle,
  ChevronRight,
  Bell,
  User,
  Search,
  Filter,
  Truck,
  Store,
} from "lucide-react";

const DashboardCliente = () => {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [activeTab, setActiveTab] = useState("todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/pedidos", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPedidos(res.data);
    } catch (err) {
      console.error("Error fetching pedidos:", err);
      setPedidos([
        {
          id: 1,
          codigo: "PIN123456",
          estado: "pendiente",
          fecha: "2026-02-24",
          total: 4500,
          items: 3,
        },
        {
          id: 2,
          codigo: "PIN789012",
          estado: "listo",
          fecha: "2026-02-23",
          total: 8200,
          items: 5,
        },
        {
          id: 3,
          codigo: "PIN345678",
          estado: "entregado",
          fecha: "2026-02-22",
          total: 1200,
          items: 1,
        },
        {
          id: 4,
          codigo: "PIN901234",
          estado: "pendiente",
          fecha: "2026-02-21",
          total: 5600,
          items: 2,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (estado) => {
    const configs = {
      pendiente: {
        color: "#f59e0b",
        bgColor: "#fffbeb",
        label: "Pendiente",
        icon: Clock,
      },
      listo: {
        color: "#10b981",
        bgColor: "#ecfdf5",
        label: "Listo para recoger",
        icon: CheckCircle,
      },
      entregado: {
        color: "#3b82f6",
        bgColor: "#eff6ff",
        label: "Entregado",
        icon: Package,
      },
      en_camino: {
        color: "#8b5cf6",
        bgColor: "#f5f3ff",
        label: "En camino",
        icon: Truck,
      },
    };
    return configs[estado] || configs.pendiente;
  };

  const filteredPedidos = pedidos.filter((p) => {
    if (activeTab === "todos") return true;
    if (activeTab === "activos")
      return ["pendiente", "listo", "en_camino"].includes(p.estado);
    if (activeTab === "historial") return p.estado === "entregado";
    return true;
  });

  const stats = {
    total: pedidos.length,
    activos: pedidos.filter((p) =>
      ["pendiente", "listo", "en_camino"].includes(p.estado),
    ).length,
    entregados: pedidos.filter((p) => p.estado === "entregado").length,
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              <User size={24} color="#3b82f6" />
            </div>
            <div>
              <p style={styles.welcomeText}>Bienvenido</p>
              <h1 style={styles.userName}>Cliente Nina</h1>
            </div>
          </div>
          <button style={styles.notificationButton}>
            <Bell size={24} color="#64748b" />
            <span style={styles.notificationBadge}>2</span>
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <StatCard
            value={stats.total}
            label="Total Pedidos"
            icon={Package}
            color="#3b82f6"
          />
          <StatCard
            value={stats.activos}
            label="En Proceso"
            icon={Clock}
            color="#f59e0b"
          />
          <StatCard
            value={stats.entregados}
            label="Entregados"
            icon={CheckCircle}
            color="#10b981"
          />
        </div>

        {/* Quick Actions */}
        <section style={styles.quickActions}>
          <button
            style={styles.actionButtonPrimary}
            onClick={() => navigate("/cliente/carrito")}
          >
            <ShoppingBag size={24} />
            <span>Nuevo Pedido</span>
            <ChevronRight size={20} />
          </button>

          <div style={styles.secondaryActions}>
            <button style={styles.actionButtonSecondary}>
              <Store size={20} />
              <span>Abacerías</span>
            </button>
            <button style={styles.actionButtonSecondary}>
              <MapPin size={20} />
              <span>Mis Direcciones</span>
            </button>
          </div>
        </section>

        {/* Tabs */}
        <div style={styles.tabsContainer}>
          <div style={styles.tabs}>
            {[
              { id: "todos", label: "Todos" },
              { id: "activos", label: "Activos" },
              { id: "historial", label: "Historial" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  ...styles.tab,
                  backgroundColor:
                    activeTab === tab.id ? "#3b82f6" : "transparent",
                  color: activeTab === tab.id ? "white" : "#64748b",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button style={styles.filterButton}>
            <Filter size={18} />
          </button>
        </div>

        {/* Pedidos List */}
        <section style={styles.pedidosSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Mis Pedidos</h2>
            <span style={styles.pedidosCount}>
              {filteredPedidos.length} pedidos
            </span>
          </div>

          {loading ? (
            <div style={styles.loadingState}>Cargando...</div>
          ) : filteredPedidos.length === 0 ? (
            <div style={styles.emptyState}>
              <Package size={48} color="#cbd5e1" />
              <p>No hay pedidos en esta categoría</p>
            </div>
          ) : (
            <div style={styles.pedidosList}>
              {filteredPedidos.map((pedido) => {
                const status = getStatusConfig(pedido.estado);
                const StatusIcon = status.icon;

                return (
                  <div
                    key={pedido.id}
                    style={styles.pedidoCard}
                    onClick={() => setSelectedPedido(pedido)}
                  >
                    <div style={styles.pedidoHeader}>
                      <div style={styles.pedidoInfo}>
                        <div
                          style={{
                            ...styles.statusBadge,
                            backgroundColor: status.bgColor,
                            color: status.color,
                          }}
                        >
                          <StatusIcon size={14} />
                          <span>{status.label}</span>
                        </div>
                        <h3 style={styles.pedidoCodigo}>#{pedido.codigo}</h3>
                        <p style={styles.pedidoFecha}>{pedido.fecha}</p>
                      </div>
                      <div style={styles.pedidoTotal}>
                        <span style={styles.totalAmount}>
                          {pedido.total?.toLocaleString()} XAF
                        </span>
                        <span style={styles.itemsCount}>
                          {pedido.items} items
                        </span>
                      </div>
                    </div>

                    <div style={styles.pedidoActions}>
                      <button style={styles.trackButton}>
                        <MapPin size={16} />
                        Tracking
                      </button>
                      <ChevronRight size={20} color="#cbd5e1" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Tracking Modal */}
      {selectedPedido && (
        <div
          style={styles.modalOverlay}
          onClick={() => setSelectedPedido(null)}
        >
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>Seguimiento del Pedido</h2>
                <p style={styles.modalSubtitle}>#{selectedPedido.codigo}</p>
              </div>
              <button
                style={styles.closeButton}
                onClick={() => setSelectedPedido(null)}
              >
                ×
              </button>
            </div>

            <div style={styles.trackingTimeline}>
              {[
                {
                  status: "Pedido recibido",
                  time: "10:30 AM",
                  completed: true,
                },
                {
                  status: "Pago confirmado",
                  time: "10:35 AM",
                  completed: true,
                },
                {
                  status: "Preparando en abacería",
                  time: "11:00 AM",
                  completed: selectedPedido.estado !== "pendiente",
                },
                {
                  status: "Listo para recoger",
                  time: "—",
                  completed:
                    selectedPedido.estado === "listo" ||
                    selectedPedido.estado === "entregado",
                },
                {
                  status: "Entregado",
                  time: "—",
                  completed: selectedPedido.estado === "entregado",
                },
              ].map((step, index, arr) => (
                <div key={index} style={styles.timelineItem}>
                  <div style={styles.timelineLeft}>
                    <div
                      style={{
                        ...styles.timelineDot,
                        backgroundColor: step.completed ? "#10b981" : "#e2e8f0",
                        borderColor: step.completed ? "#10b981" : "#cbd5e1",
                      }}
                    >
                      {step.completed && (
                        <CheckCircle size={14} color="white" />
                      )}
                    </div>
                    {index < arr.length - 1 && (
                      <div
                        style={{
                          ...styles.timelineLine,
                          backgroundColor:
                            step.completed && arr[index + 1].completed
                              ? "#10b981"
                              : "#e2e8f0",
                        }}
                      />
                    )}
                  </div>
                  <div style={styles.timelineContent}>
                    <p
                      style={{
                        ...styles.timelineStatus,
                        color: step.completed ? "#0f172a" : "#94a3b8",
                      }}
                    >
                      {step.status}
                    </p>
                    <p style={styles.timelineTime}>{step.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.modalFooter}>
              <div style={styles.pickupInfo}>
                <Store size={20} color="#3b82f6" />
                <div>
                  <p style={styles.pickupLabel}>Punto de recogida</p>
                  <p style={styles.pickupValue}>Abacería Central Malabo</p>
                </div>
              </div>
              <button style={styles.qrButton}>Ver código QR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ value, label, icon: Icon, color }) => (
  <div style={styles.statCard}>
    <div style={{ ...styles.statIcon, backgroundColor: `${color}15` }}>
      <Icon size={24} color={color} />
    </div>
    <div>
      <p style={styles.statValue}>{value}</p>
      <p style={styles.statLabel}>{label}</p>
    </div>
  </div>
);

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  header: {
    backgroundColor: "white",
    borderBottom: "1px solid #e2e8f0",
    padding: "20px",
  },
  headerContent: {
    maxWidth: 600,
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    backgroundColor: "#dbeafe",
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 13,
    color: "#64748b",
    margin: "0 0 2px 0",
  },
  userName: {
    fontSize: 18,
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
  },
  notificationButton: {
    position: "relative",
    background: "none",
    border: "none",
    padding: 8,
    cursor: "pointer",
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
  },
  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    backgroundColor: "#ef4444",
    color: "white",
    fontSize: 11,
    fontWeight: 700,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  main: {
    maxWidth: 600,
    margin: "0 auto",
    padding: 20,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    display: "flex",
    alignItems: "center",
    gap: 12,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 2px 0",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    margin: 0,
  },
  quickActions: {
    marginBottom: 24,
  },
  actionButtonPrimary: {
    width: "100%",
    padding: "20px 24px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: 16,
    fontSize: 17,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
    marginBottom: 12,
  },
  secondaryActions: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  actionButtonSecondary: {
    padding: "16px",
    backgroundColor: "white",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    color: "#475569",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
  },
  tabsContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  tabs: {
    display: "flex",
    gap: 8,
    backgroundColor: "#f1f5f9",
    padding: 4,
    borderRadius: 12,
  },
  tab: {
    padding: "8px 16px",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#64748b",
  },
  pedidosSection: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
  },
  pedidosCount: {
    fontSize: 13,
    color: "#64748b",
    backgroundColor: "#f1f5f9",
    padding: "4px 12px",
    borderRadius: 20,
  },
  pedidosList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  pedidoCard: {
    border: "1px solid #f1f5f9",
    borderRadius: 16,
    padding: 16,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  pedidoHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  pedidoInfo: {
    flex: 1,
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 8,
  },
  pedidoCodigo: {
    fontSize: 16,
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 4px 0",
  },
  pedidoFecha: {
    fontSize: 13,
    color: "#64748b",
    margin: 0,
  },
  pedidoTotal: {
    textAlign: "right",
  },
  totalAmount: {
    display: "block",
    fontSize: 18,
    fontWeight: 800,
    color: "#3b82f6",
    marginBottom: 4,
  },
  itemsCount: {
    fontSize: 13,
    color: "#64748b",
  },
  pedidoActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTop: "1px solid #f1f5f9",
  },
  trackButton: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 16px",
    backgroundColor: "#eff6ff",
    color: "#3b82f6",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  loadingState: {
    textAlign: "center",
    padding: 40,
    color: "#64748b",
  },
  emptyState: {
    textAlign: "center",
    padding: 40,
    color: "#94a3b8",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(4px)",
    zIndex: 50,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: "24px 24px 0 0",
    width: "100%",
    maxWidth: 600,
    maxHeight: "80vh",
    overflow: "auto",
    animation: "slideUp 0.3s ease-out",
  },
  modalHeader: {
    padding: 24,
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 4px 0",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#64748b",
    margin: 0,
    fontFamily: "monospace",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    border: "none",
    backgroundColor: "#f1f5f9",
    fontSize: 20,
    color: "#64748b",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  trackingTimeline: {
    padding: 24,
  },
  timelineItem: {
    display: "flex",
    gap: 16,
    position: "relative",
  },
  timelineLeft: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    border: "2px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    backgroundColor: "white",
  },
  timelineLine: {
    width: 2,
    height: 40,
    marginTop: 4,
  },
  timelineContent: {
    paddingBottom: 24,
    flex: 1,
  },
  timelineStatus: {
    fontSize: 15,
    fontWeight: 600,
    margin: "0 0 4px 0",
  },
  timelineTime: {
    fontSize: 13,
    color: "#64748b",
    margin: 0,
  },
  modalFooter: {
    padding: 24,
    borderTop: "1px solid #f1f5f9",
    backgroundColor: "#f8fafc",
  },
  pickupInfo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  pickupLabel: {
    fontSize: 12,
    color: "#64748b",
    margin: "0 0 2px 0",
  },
  pickupValue: {
    fontSize: 15,
    fontWeight: 600,
    color: "#0f172a",
    margin: 0,
  },
  qrButton: {
    width: "100%",
    padding: 16,
    backgroundColor: "#0f172a",
    color: "white",
    border: "none",
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default DashboardCliente;
