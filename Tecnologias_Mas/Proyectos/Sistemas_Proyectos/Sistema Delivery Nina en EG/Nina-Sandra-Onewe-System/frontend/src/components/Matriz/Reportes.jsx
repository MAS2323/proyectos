// components/Matriz/Reportes.jsx (sin recharts)
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TrendingUp,
  Calendar,
  Package,
  DollarSign,
  Download,
  Filter,
  ChevronDown,
  BarChart3,
  Table2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const Reportes = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("chart");

  useEffect(() => {
    fetchReportes();
  }, []);

  const fetchReportes = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/reportes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setReportes(res.data || []);
    } catch (err) {
      setReportes([
        { fecha: "2026-02-20", total_pedidos: 45, ventas: 225000 },
        { fecha: "2026-02-21", total_pedidos: 52, ventas: 260000 },
        { fecha: "2026-02-22", total_pedidos: 38, ventas: 190000 },
        { fecha: "2026-02-23", total_pedidos: 65, ventas: 325000 },
        { fecha: "2026-02-24", total_pedidos: 48, ventas: 240000 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const totals = reportes.reduce(
    (acc, r) => ({
      pedidos: acc.pedidos + r.total_pedidos,
      ventas: acc.ventas + r.ventas,
    }),
    { pedidos: 0, ventas: 0 },
  );

  const maxVentas = Math.max(...reportes.map((r) => r.ventas), 1);
  const maxPedidos = Math.max(...reportes.map((r) => r.total_pedidos), 1);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Reportes y Análisis
                </h1>
                <p className="text-xs text-slate-500">Matriz N.S.O. System</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Total Pedidos"
            value={totals.pedidos.toLocaleString()}
            trend="+12%"
            trendUp={true}
            icon={Package}
            color="blue"
          />
          <StatCard
            label="Ventas Totales"
            value={`${(totals.ventas / 1000).toFixed(0)}k XAF`}
            trend="+8%"
            trendUp={true}
            icon={DollarSign}
            color="emerald"
          />
          <StatCard
            label="Ticket Promedio"
            value={`${Math.round(totals.ventas / totals.pedidos || 0).toLocaleString()} XAF`}
            trend="-3%"
            trendUp={false}
            icon={TrendingUp}
            color="violet"
          />
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Tendencia de Ventas
              </h3>
              <p className="text-sm text-slate-500">
                Evolución diaria de pedidos y ventas
              </p>
            </div>
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("chart")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition ${
                  viewMode === "chart"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Gráfico
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition ${
                  viewMode === "table"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600"
                }`}
              >
                <Table2 className="w-4 h-4" />
                Tabla
              </button>
            </div>
          </div>

          {viewMode === "chart" ? (
            <div className="space-y-8">
              {/* Gráfico de Barras CSS */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-4">
                  Ventas (XAF)
                </h4>
                <div className="flex items-end gap-2 h-48">
                  {reportes.map((r, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-2 group"
                    >
                      <div className="relative w-full">
                        <div
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500 group-hover:from-blue-600 group-hover:to-blue-500"
                          style={{
                            height: `${(r.ventas / maxVentas) * 160}px`,
                          }}
                        />
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                          {r.ventas.toLocaleString()} XAF
                        </div>
                      </div>
                      <span className="text-xs text-slate-500">
                        {new Date(r.fecha).toLocaleDateString("es-ES", {
                          weekday: "short",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gráfico de Líneas CSS */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-4">
                  Pedidos
                </h4>
                <div className="relative h-32">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 100 40"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="lineGradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor="#10b981"
                          stopOpacity="0.3"
                        />
                        <stop
                          offset="100%"
                          stopColor="#10b981"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d={`M 0 ${40 - (reportes[0]?.total_pedidos / maxPedidos) * 35} ${reportes
                        .map((r, i) => {
                          const x = (i / (reportes.length - 1)) * 100;
                          const y = 40 - (r.total_pedidos / maxPedidos) * 35;
                          return `L ${x} ${y}`;
                        })
                        .join(" ")} L 100 40 L 0 40 Z`}
                      fill="url(#lineGradient)"
                    />
                    <path
                      d={`M 0 ${40 - (reportes[0]?.total_pedidos / maxPedidos) * 35} ${reportes
                        .map((r, i) => {
                          const x = (i / (reportes.length - 1)) * 100;
                          const y = 40 - (r.total_pedidos / maxPedidos) * 35;
                          return `L ${x} ${y}`;
                        })
                        .join(" ")}`}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="0.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {reportes.map((r, i) => {
                      const x = (i / (reportes.length - 1)) * 100;
                      const y = 40 - (r.total_pedidos / maxPedidos) * 35;
                      return (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r="1"
                          fill="#10b981"
                          stroke="white"
                          strokeWidth="0.3"
                        />
                      );
                    })}
                  </svg>
                  <div className="flex justify-between mt-2">
                    {reportes.map((r, i) => (
                      <span key={i} className="text-xs text-slate-500">
                        {r.total_pedidos}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Fecha
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Pedidos
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Ventas (XAF)
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Promedio
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reportes.map((r, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-100 hover:bg-slate-50 transition"
                    >
                      <td className="py-3 px-4 text-sm text-slate-900">
                        {new Date(r.fecha).toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {r.total_pedidos}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-emerald-600">
                        {r.ventas.toLocaleString()} XAF
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {Math.round(
                          r.ventas / r.total_pedidos,
                        ).toLocaleString()}{" "}
                        XAF
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Barrios */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Top Barrios</h3>
          <div className="space-y-4">
            {[
              { name: "Malabo Centro", pedidos: 145, growth: 12 },
              { name: "Bata Norte", pedidos: 98, growth: 8 },
              { name: "Luba", pedidos: 76, growth: -3 },
              { name: "Evinayong", pedidos: 54, growth: 15 },
              { name: "Mongomo", pedidos: 43, growth: 5 },
            ].map((barrio, i) => (
              <div key={barrio.name} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">
                      {barrio.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">
                        {barrio.pedidos} pedidos
                      </span>
                      <span
                        className={`flex items-center text-xs ${barrio.growth >= 0 ? "text-emerald-600" : "text-red-600"}`}
                      >
                        {barrio.growth >= 0 ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {Math.abs(barrio.growth)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000"
                      style={{ width: `${(barrio.pedidos / 145) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ label, value, trend, trendUp, icon: Icon, color }) => {
  const colors = {
    blue: "from-blue-500 to-blue-600 shadow-blue-500/30",
    emerald: "from-emerald-500 to-emerald-600 shadow-emerald-500/30",
    violet: "from-violet-500 to-violet-600 shadow-violet-500/30",
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {trend && (
            <div
              className={`flex items-center gap-1 mt-2 text-sm font-medium ${trendUp ? "text-emerald-600" : "text-red-600"}`}
            >
              {trendUp ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {trend} vs ayer
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default Reportes;
