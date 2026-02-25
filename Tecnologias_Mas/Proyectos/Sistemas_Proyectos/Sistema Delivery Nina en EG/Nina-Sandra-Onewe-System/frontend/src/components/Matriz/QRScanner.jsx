// components/Matriz/QRScanner.jsx
import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Camera, X, ScanLine } from "lucide-react";

const QRScanner = ({ onScanSuccess, onScanError }) => {
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState(null);

  useEffect(() => {
    if (!scanning || !scannerRef.current) return;

    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: { width: 280, height: 280 },
      rememberLastUsedCamera: true,
      aspectRatio: 1,
    });

    scanner.render(
      (decodedText) => {
        setLastScan(decodedText);
        onScanSuccess?.(decodedText);
        // No detener automáticamente para permitir múltiples escaneos
      },
      (error) => {
        if (!error?.includes?.("No QR code found")) {
          onScanError?.(error);
        }
      },
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [scanning, onScanSuccess, onScanError]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <ScanLine className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Escanear Código QR</h3>
            <p className="text-sm text-slate-500">Apunta la cámara al código</p>
          </div>
        </div>
        <button
          onClick={() => setScanning(!scanning)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition ${
            scanning
              ? "bg-red-100 text-red-700 hover:bg-red-200"
              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30"
          }`}
        >
          {scanning ? (
            <>
              <X className="w-4 h-4" />
              Detener
            </>
          ) : (
            <>
              <Camera className="w-4 h-4" />
              Iniciar
            </>
          )}
        </button>
      </div>

      <div className="p-6">
        {scanning ? (
          <div className="space-y-4">
            <div
              id="qr-reader"
              ref={scannerRef}
              className="rounded-xl overflow-hidden border-2 border-indigo-200"
            />
            {lastScan && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 animate-in fade-in">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-emerald-800">
                    Último escaneo:
                  </p>
                  <p className="text-sm text-emerald-600 font-mono">
                    {lastScan}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ScanLine className="w-12 h-12 text-slate-300" />
            </div>
            <h4 className="text-lg font-semibold text-slate-700 mb-2">
              Escáner inactivo
            </h4>
            <p className="text-slate-500 max-w-sm mx-auto">
              Haz clic en "Iniciar" para activar la cámara y escanear códigos QR
              de productos o ubicaciones
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
