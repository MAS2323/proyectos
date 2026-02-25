// components/Cliente/Carrito.jsx
import React, { useState } from "react";
import axios from "axios";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  MapPin,
  CreditCard,
  Package,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

const Carrito = () => {
  const [productos, setProductos] = useState([
    {
      id: 1,
      nombre: "Arroz Premium 5kg",
      precio: 2500,
      cantidad: 1,
      imagen: "🍚",
    },
    {
      id: 2,
      nombre: "Aceite Vegetal 1L",
      precio: 1200,
      cantidad: 2,
      imagen: "🛢️",
    },
    {
      id: 3,
      nombre: "Leche Entera 1L",
      precio: 800,
      cantidad: 1,
      imagen: "🥛",
    },
  ]);
  const [barrio, setBarrio] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [codigoPedido, setCodigoPedido] = useState("");

  const total = productos.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

  const updateCantidad = (id, delta) => {
    setProductos(
      productos.map((p) => {
        if (p.id === id) {
          const nuevaCantidad = Math.max(1, p.cantidad + delta);
          return { ...p, cantidad: nuevaCantidad };
        }
        return p;
      }),
    );
  };

  const removeProducto = (id) => {
    setProductos(productos.filter((p) => p.id !== id));
  };

  const handlePedido = async () => {
    if (!barrio.trim()) {
      alert("Por favor ingresa tu barrio o dirección de entrega");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8080/pedidos",
        {
          cliente_id: 1,
          productos: productos,
          barrio: barrio,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setCodigoPedido(res.data.codigo);
      setSuccess(true);
      setProductos([]);
    } catch (err) {
      console.error("Error creando pedido:", err);
      alert("Error al crear el pedido. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={styles.successContainer}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>
            <CheckCircle size={64} color="#10b981" />
          </div>
          <h2 style={styles.successTitle}>¡Pedido Confirmado!</h2>
          <p style={styles.successText}>
            Tu pedido ha sido creado exitosamente
          </p>

          <div style={styles.codigoBox}>
            <span style={styles.codigoLabel}>Código de Pedido</span>
            <span style={styles.codigoValue}>{codigoPedido}</span>
          </div>

          <p style={styles.instructions}>
            Muestra este código en la abacería para recoger tu pedido
          </p>

          <button
            style={styles.buttonPrimary}
            onClick={() => (window.location.href = "/cliente")}
          >
            Ver mis pedidos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <button style={styles.backButton} onClick={() => window.history.back()}>
          <ArrowLeft size={24} color="#64748b" />
        </button>
        <div style={styles.headerTitle}>
          <ShoppingCart size={24} color="#3b82f6" />
          <h1 style={styles.title}>Mi Carrito</h1>
        </div>
        <div style={{ width: 40 }} />
      </header>

      <main style={styles.main}>
        {/* Lista de Productos */}
        <section style={styles.productosSection}>
          <h2 style={styles.sectionTitle}>Productos ({productos.length})</h2>

          <div style={styles.productosList}>
            {productos.map((producto) => (
              <div key={producto.id} style={styles.productoCard}>
                <div style={styles.productoImagen}>
                  <span style={{ fontSize: 40 }}>{producto.imagen}</span>
                </div>

                <div style={styles.productoInfo}>
                  <h3 style={styles.productoNombre}>{producto.nombre}</h3>
                  <p style={styles.productoPrecio}>
                    {producto.precio.toLocaleString()} XAF
                  </p>
                </div>

                <div style={styles.productoActions}>
                  <div style={styles.cantidadControl}>
                    <button
                      style={styles.cantidadButton}
                      onClick={() => updateCantidad(producto.id, -1)}
                    >
                      <Minus size={16} />
                    </button>
                    <span style={styles.cantidadValue}>
                      {producto.cantidad}
                    </span>
                    <button
                      style={styles.cantidadButton}
                      onClick={() => updateCantidad(producto.id, 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    style={styles.deleteButton}
                    onClick={() => removeProducto(producto.id)}
                  >
                    <Trash2 size={18} color="#ef4444" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dirección */}
        <section style={styles.direccionSection}>
          <div style={styles.sectionHeader}>
            <MapPin size={20} color="#3b82f6" />
            <h2 style={styles.sectionTitle}>Dirección de Entrega</h2>
          </div>

          <div style={styles.inputContainer}>
            <input
              type="text"
              placeholder="Ej: Malabo Centro, cerca del mercado central"
              value={barrio}
              onChange={(e) => setBarrio(e.target.value)}
              style={styles.input}
            />
          </div>
        </section>

        {/* Resumen */}
        <section style={styles.resumenSection}>
          <div style={styles.sectionHeader}>
            <CreditCard size={20} color="#3b82f6" />
            <h2 style={styles.sectionTitle}>Resumen</h2>
          </div>

          <div style={styles.resumenRows}>
            <div style={styles.resumenRow}>
              <span style={styles.resumenLabel}>Subtotal</span>
              <span style={styles.resumenValue}>
                {total.toLocaleString()} XAF
              </span>
            </div>
            <div style={styles.resumenRow}>
              <span style={styles.resumenLabel}>Envío</span>
              <span style={{ ...styles.resumenValue, color: "#10b981" }}>
                Gratis
              </span>
            </div>
            <div
              style={{
                ...styles.resumenRow,
                borderTop: "2px solid #e5e7eb",
                paddingTop: 16,
                marginTop: 8,
              }}
            >
              <span
                style={{
                  ...styles.resumenLabel,
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                Total
              </span>
              <span
                style={{
                  ...styles.resumenValue,
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#3b82f6",
                }}
              >
                {total.toLocaleString()} XAF
              </span>
            </div>
          </div>
        </section>

        {/* Botón Checkout */}
        <button
          onClick={handlePedido}
          disabled={productos.length === 0 || loading}
          style={{
            ...styles.checkoutButton,
            opacity: productos.length === 0 || loading ? 0.5 : 1,
            cursor:
              productos.length === 0 || loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? (
            <span style={styles.loadingText}>Procesando...</span>
          ) : (
            <>
              <Package size={24} />
              <span>Confirmar Pedido</span>
              <span style={styles.checkoutTotal}>
                ({total.toLocaleString()} XAF)
              </span>
            </>
          )}
        </button>
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  header: {
    backgroundColor: "white",
    borderBottom: "1px solid #e2e8f0",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  backButton: {
    background: "none",
    border: "none",
    padding: 8,
    cursor: "pointer",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
  },
  main: {
    maxWidth: 600,
    margin: "0 auto",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#0f172a",
    margin: 0,
  },
  productosSection: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  productosList: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginTop: 16,
  },
  productoCard: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    border: "1px solid #f1f5f9",
  },
  productoImagen: {
    width: 64,
    height: 64,
    backgroundColor: "white",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  productoInfo: {
    flex: 1,
    minWidth: 0,
  },
  productoNombre: {
    fontSize: 15,
    fontWeight: 600,
    color: "#0f172a",
    margin: "0 0 4px 0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  productoPrecio: {
    fontSize: 14,
    fontWeight: 700,
    color: "#3b82f6",
    margin: 0,
  },
  productoActions: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  cantidadControl: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 4,
    border: "1px solid #e2e8f0",
  },
  cantidadButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    border: "none",
    backgroundColor: "#f1f5f9",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#475569",
  },
  cantidadValue: {
    fontSize: 14,
    fontWeight: 600,
    color: "#0f172a",
    minWidth: 24,
    textAlign: "center",
  },
  deleteButton: {
    background: "none",
    border: "none",
    padding: 8,
    cursor: "pointer",
    borderRadius: 6,
  },
  direccionSection: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    border: "2px solid #e2e8f0",
    borderRadius: 12,
    fontSize: 15,
    outline: "none",
    transition: "all 0.2s",
    boxSizing: "border-box",
  },
  resumenSection: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  resumenRows: {
    marginTop: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  resumenRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resumenLabel: {
    fontSize: 15,
    color: "#64748b",
  },
  resumenValue: {
    fontSize: 15,
    fontWeight: 600,
    color: "#0f172a",
  },
  checkoutButton: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: 16,
    padding: "20px 24px",
    fontSize: 17,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
    transition: "all 0.2s",
    marginTop: 8,
  },
  checkoutTotal: {
    fontSize: 14,
    opacity: 0.9,
    fontWeight: 500,
  },
  loadingText: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  successContainer: {
    minHeight: "100vh",
    backgroundColor: "#f0fdf4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  successCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 40,
    textAlign: "center",
    maxWidth: 400,
    width: "100%",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },
  successIcon: {
    width: 100,
    height: 100,
    backgroundColor: "#dcfce7",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 8px 0",
  },
  successText: {
    fontSize: 16,
    color: "#64748b",
    margin: "0 0 24px 0",
  },
  codigoBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    border: "2px dashed #3b82f6",
  },
  codigoLabel: {
    display: "block",
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  codigoValue: {
    display: "block",
    fontSize: 32,
    fontWeight: 800,
    color: "#3b82f6",
    fontFamily: "monospace",
  },
  instructions: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 24,
    lineHeight: 1.5,
  },
  buttonPrimary: {
    width: "100%",
    padding: "16px 24px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default Carrito;
