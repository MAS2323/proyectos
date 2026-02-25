// components/layout/AuthLayout.jsx
import React from "react";

export const AuthLayout = ({ children }) => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background:
        "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #581c87 100%)",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Background Effects */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        style={{
          position: "absolute",
          top: 0,
          left: "25%",
          width: "24rem",
          height: "24rem",
          background: "rgba(59, 130, 246, 0.1)",
          borderRadius: "50%",
          filter: "blur(64px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: "25%",
          width: "24rem",
          height: "24rem",
          background: "rgba(168, 85, 247, 0.1)",
          borderRadius: "50%",
          filter: "blur(64px)",
        }}
      />
    </div>

    {/* Main Content - Centered */}
    <main
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        position: "relative",
        zIndex: 10,
      }}
    >
      {children}
    </main>

    {/* Footer */}
    <footer
      style={{
        position: "relative",
        zIndex: 10,
        padding: "1.5rem",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "28rem", margin: "0 auto", padding: "0 1rem" }}>
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)",
            marginBottom: "1rem",
          }}
        />
        <p style={{ color: "rgba(147, 197, 253, 0.4)", fontSize: "0.75rem" }}>
          Sistema seguro de autenticación • N.S.O. System ©{" "}
          {new Date().getFullYear()}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginTop: "0.5rem",
          }}
        >
          {["Seguro", "Rápido", "Confiable"].map((text, i) => (
            <React.Fragment key={text}>
              <span
                style={{
                  fontSize: "10px",
                  color: "rgba(96, 165, 250, 0.3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {text}
              </span>
              {i < 2 && (
                <span
                  style={{ fontSize: "10px", color: "rgba(96, 165, 250, 0.3)" }}
                >
                  •
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </footer>

    <style>{`
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
        20%, 40%, 60%, 80% { transform: translateX(4px); }
      }
      .animate-shake {
        animation: shake 0.4s ease-in-out;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in {
        animation: fadeIn 0.3s ease-out;
      }
    `}</style>
  </div>
);
