import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // npm install jwt-decode
import Login from "./pages/Login";
import DashboardCliente from "./components/Cliente/Dashboard";
import Carrito from "./components/Cliente/Carrito";
import ListaPedidos from "./components/Abaceria/ListaPedidos";
import SeleccionAbaceria from "./components/Agencia/SeleccionAbaceria";
import Reportes from "./components/Matriz/Reportes";
import AdminDashboard from "./components/Matriz/AdminDashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [rol, setRol] = useState(token ? jwtDecode(token).rol : null);

  const isAuthenticated = (requiredRol) =>
    token && (!requiredRol || rol === requiredRol);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route
            path="/"
            element={<Login setToken={setToken} setRol={setRol} />}
          />
          <Route
            path="/cliente"
            element={
              isAuthenticated("cliente") ? (
                <DashboardCliente />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/cliente/carrito"
            element={
              isAuthenticated("cliente") ? <Carrito /> : <Navigate to="/" />
            }
          />
          <Route
            path="/abaceria/pedidos"
            element={
              isAuthenticated("abaceria") ? (
                <ListaPedidos />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/agencia/seleccion"
            element={
              isAuthenticated("agencia") ? (
                <SeleccionAbaceria />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/matriz/reportes"
            element={
              isAuthenticated("matriz") ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
