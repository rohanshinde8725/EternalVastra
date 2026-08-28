import React, { createContext, useContext, useState, useCallback } from "react";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiAlertTriangle,
  FiInfo,
  FiX,
} from "react-icons/fi";

const ToastContext = createContext(null);

const toastStyles = {
  success: {
    bg: "bg-white border-l-4 border-emerald-500",
    iconBg: "bg-emerald-50 text-emerald-600",
    icon: FiCheckCircle,
    progress: "bg-emerald-500",
    title: "text-emerald-950",
  },
  error: {
    bg: "bg-white border-l-4 border-[#8B1C2C]",
    iconBg: "bg-rose-50 text-[#8B1C2C]",
    icon: FiAlertCircle,
    progress: "bg-[#8B1C2C]",
    title: "text-rose-950",
  },
  warning: {
    bg: "bg-white border-l-4 border-amber-500",
    iconBg: "bg-amber-50 text-amber-600",
    icon: FiAlertTriangle,
    progress: "bg-amber-500",
    title: "text-amber-950",
  },
  info: {
    bg: "bg-white border-l-4 border-blue-500",
    iconBg: "bg-blue-50 text-blue-600",
    icon: FiInfo,
    progress: "bg-blue-500",
    title: "text-blue-950",
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type = "info", message = "", title = "", duration = 4000) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast = {
        id,
        type,
        message,
        title: title || (type === "success" ? "Success" : type === "error" ? "Error" : type === "warning" ? "Notice" : "Information"),
        duration,
      };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const showToast = useCallback(
    (message, type = "info", title = "", duration = 4000) => {
      return addToast(type, message, title, duration);
    },
    [addToast]
  );

  showToast.success = (msg, title, duration) => addToast("success", msg, title, duration);
  showToast.error = (msg, title, duration) => addToast("error", msg, title, duration);
  showToast.warning = (msg, title, duration) => addToast("warning", msg, title, duration);
  showToast.info = (msg, title, duration) => addToast("info", msg, title, duration);

  return (
    <ToastContext.Provider value={{ showToast, addToast, removeToast }}>
      {children}
      {/* Toast Notification Container Stack */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => {
          const config = toastStyles[toast.type] || toastStyles.info;
          const Icon = config.icon;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto rounded-xl shadow-2xl p-4 border border-slate-100 relative overflow-hidden transition-all duration-300 ease-out transform translate-y-0 ${config.bg}`}
              style={{
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.iconBg}`}>
                  <Icon className="text-lg" />
                </div>
                <div className="flex-1 min-w-0 pr-2">
                  <h5 className={`text-xs font-bold ${config.title}`}>{toast.title}</h5>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed break-words">{toast.message}</p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition flex-shrink-0"
                >
                  <FiX className="text-sm" />
                </button>
              </div>

              {/* Animated Progress Bar */}
              {toast.duration > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full ${config.progress}`}
                    style={{
                      animation: `shrinkWidth ${toast.duration}ms linear forwards`,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
