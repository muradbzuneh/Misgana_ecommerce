import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes,
  FaTimesCircle,
  FaBell,
} from "react-icons/fa";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timeoutRef = useRef(null);

  const showToast = useCallback(
    (message, type = "success", duration = 3000) => {
      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        setToast(null);
      }, duration);

      setToast({ message, type, duration });
    },
    [],
  );

  const removeToast = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setToast(null);
  }, []);

  const getToastConfig = (type) => {
    const configs = {
      success: {
        icon: <FaCheckCircle className="text-xl" />,
        bgColor: "bg-gradient-to-r from-green-500 to-emerald-600",
        borderColor: "border-green-400",
        textColor: "text-white",
      },
      error: {
        icon: <FaTimesCircle className="text-xl" />,
        bgColor: "bg-gradient-to-r from-red-500 to-rose-600",
        borderColor: "border-red-400",
        textColor: "text-white",
      },
      warning: {
        icon: <FaExclamationCircle className="text-xl" />,
        bgColor: "bg-gradient-to-r from-yellow-500 to-orange-600",
        borderColor: "border-yellow-400",
        textColor: "text-white",
      },
      info: {
        icon: <FaInfoCircle className="text-xl" />,
        bgColor: "bg-gradient-to-r from-blue-500 to-indigo-600",
        borderColor: "border-blue-400",
        textColor: "text-white",
      },
      dark: {
        icon: <FaBell className="text-xl" />,
        bgColor: "bg-gradient-to-r from-gray-800 to-gray-900",
        borderColor: "border-gray-600",
        textColor: "text-white",
      },
    };

    return configs[type] || configs.success;
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast UI */}
      {toast &&
        (() => {
          const config = getToastConfig(toast.type);

          return (
            <div className="fixed top-20 right-5 z-50">
              <div
                className={`
                relative flex items-center gap-3
                min-w-[280px] max-w-[380px]
                px-4 py-3 rounded-xl shadow-2xl
                border-l-4
                transform transition-all duration-300 animate-slide-in
                ${config.bgColor}
                ${config.borderColor}
              `}
                role="alert"
              >
                {/* Icon */}
                <div className={config.textColor}>{config.icon}</div>

                {/* Message */}
                <div className="flex-1">
                  <p className={`${config.textColor} text-sm font-medium`}>
                    {toast.message}
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={removeToast}
                  className={`
                  ${config.textColor} 
                  opacity-70 hover:opacity-100 
                  transition-opacity duration-200
                  focus:outline-none
                `}
                  aria-label="Close toast"
                >
                  <FaTimes className="text-sm" />
                </button>

                {/* Progress Bar */}
                <div
                  className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-xl"
                  style={{
                    width: "100%",
                    animation: `shrink ${toast.duration}ms linear forwards`,
                  }}
                />
              </div>
            </div>
          );
        })()}

      {/* Animations */}
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
