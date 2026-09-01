import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiAlertTriangle,
  FiInfo,
  FiX,
  FiTrash2,
} from "react-icons/fi";
import { HiOutlineShoppingBag, HiOutlineHeart, HiHeart } from "react-icons/hi2";

const ToastContext = createContext(null);

const toastStyles = {
  cart_add: {
    borderAccent: "border-l-4 border-[#75212e]",
    iconBg: "bg-[#75212e] text-white shadow-xs",
    icon: HiOutlineShoppingBag,
    badgeLabel: "Cart Updated",
    title: "Added to Bag",
    progress: "bg-[#75212e]",
  },
  cart_remove: {
    borderAccent: "border-l-4 border-[#75212e]",
    iconBg: "bg-[#75212e] text-white shadow-xs",
    icon: FiTrash2,
    badgeLabel: "Cart Updated",
    title: "Item Removed",
    progress: "bg-[#75212e]",
  },
  wishlist_add: {
    borderAccent: "border-l-4 border-[#75212e]",
    iconBg: "bg-[#75212e] text-white shadow-xs",
    icon: HiHeart,
    badgeLabel: "Wishlist Saved",
    title: "Added to Wishlist",
    progress: "bg-[#75212e]",
  },
  wishlist_remove: {
    borderAccent: "border-l-4 border-[#75212e]",
    iconBg: "bg-[#75212e] text-white shadow-xs",
    icon: HiOutlineHeart,
    badgeLabel: "Wishlist Updated",
    title: "Removed from Wishlist",
    progress: "bg-[#75212e]",
  },
  success: {
    borderAccent: "border-l-4 border-[#75212e]",
    iconBg: "bg-[#75212e] text-white shadow-xs",
    icon: FiCheckCircle,
    badgeLabel: "Success",
    title: "Action Completed",
    progress: "bg-[#75212e]",
  },
  error: {
    borderAccent: "border-l-4 border-[#75212e]",
    iconBg: "bg-[#75212e] text-white shadow-xs",
    icon: FiAlertCircle,
    badgeLabel: "Attention",
    title: "Action Failed",
    progress: "bg-[#75212e]",
  },
  warning: {
    borderAccent: "border-l-4 border-[#75212e]",
    iconBg: "bg-[#75212e] text-white shadow-xs",
    icon: FiAlertTriangle,
    badgeLabel: "Notice",
    title: "Please Review",
    progress: "bg-[#75212e]",
  },
  info: {
    borderAccent: "border-l-4 border-[#75212e]",
    iconBg: "bg-[#75212e] text-white shadow-xs",
    icon: FiInfo,
    badgeLabel: "Notice",
    title: "Information",
    progress: "bg-[#75212e]",
  },
};

const resolveToastVariant = (type, message) => {
  const msg = String(message || "").toLowerCase();

  // If already explicit
  if (["cart_add", "cart_remove", "wishlist_add", "wishlist_remove"].includes(type)) {
    return type;
  }

  // Smart Cart detection
  if (msg.includes("cart") || msg.includes("bag")) {
    if (msg.includes("remove") || msg.includes("cleared") || msg.includes("delete")) {
      return "cart_remove";
    }
    return "cart_add";
  }

  // Smart Wishlist detection
  if (msg.includes("wishlist") || msg.includes("saved to wishlist") || msg.includes("removed from wishlist")) {
    if (msg.includes("remove") || msg.includes("deleted")) {
      return "wishlist_remove";
    }
    return "wishlist_add";
  }

  return type || "info";
};

// Formatter to give quoted item titles bold emphasis
const formatToastMessage = (text) => {
  if (!text || typeof text !== "string") return text;
  const parts = text.split(/(".*?")/g);
  return parts.map((part, i) => {
    if (part.startsWith('"') && part.endsWith('"')) {
      return (
        <span key={i} className="font-bold text-[#75212e]">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type = "info", message = "", customTitle = "", duration = 4000) => {
      const variantKey = resolveToastVariant(type, message);
      const config = toastStyles[variantKey] || toastStyles.info;
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const newToast = {
        id,
        variantKey,
        message,
        title: customTitle || config.title,
        badgeLabel: config.badgeLabel,
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
  showToast.cart = (msg, title, duration) => addToast("cart_add", msg, title, duration);
  showToast.wishlist = (msg, title, duration) => addToast("wishlist_add", msg, title, duration);

  return (
    <ToastContext.Provider value={{ showToast, addToast, removeToast }}>
      {children}
      
      {/* Toast Notification Container Stack */}
      <div className="fixed top-5 right-5 z-[99999] flex flex-col gap-3 max-w-[370px] w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            const config = toastStyles[toast.variantKey] || toastStyles.info;
            const Icon = config.icon;

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: -16, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -12, transition: { duration: 0.18 } }}
                transition={{ type: "spring", damping: 26, stiffness: 380 }}
                className={`pointer-events-auto w-full rounded-xl bg-white p-3.5 border border-[#75212e]/15 shadow-[0_10px_30px_rgba(117,33,46,0.12)] relative overflow-hidden ${config.borderAccent}`}
              >
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${config.iconBg}`}>
                    <Icon className="text-lg" />
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0 pr-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#75212e] mb-0.5">
                      {toast.badgeLabel}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-800 leading-snug break-words font-medium">
                      {formatToastMessage(toast.message)}
                    </p>
                  </div>

                  {/* Dismiss Button */}
                  <button
                    onClick={() => removeToast(toast.id)}
                    aria-label="Close notification"
                    className="p-1 rounded-md text-slate-400 hover:text-[#75212e] hover:bg-rose-50 transition-colors flex-shrink-0 cursor-pointer"
                  >
                    <FiX className="text-sm" />
                  </button>
                </div>

                {/* Animated Progress Bar */}
                {toast.duration > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-rose-50 overflow-hidden">
                    <motion.div
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: toast.duration / 1000, ease: "linear" }}
                      className={`h-full ${config.progress}`}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
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
