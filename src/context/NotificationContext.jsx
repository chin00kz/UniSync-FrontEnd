import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  X, 
  AlertTriangle 
} from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmDetails, setConfirmDetails] = useState(null);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const confirm = useCallback((details) => {
    return new Promise((resolve) => {
      setConfirmDetails({
        ...details,
        onConfirm: () => {
          setConfirmDetails(null);
          resolve(true);
        },
        onCancel: () => {
          setConfirmDetails(null);
          resolve(false);
        }
      });
    });
  }, []);

  return (
    <NotificationContext.Provider value={{ showToast, confirm }}>
      {children}
      <Toaster toasts={toasts} removeToast={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
      {confirmDetails && <NotificationModal {...confirmDetails} />}
    </NotificationContext.Provider>
  );
};

const Toaster = ({ toasts, removeToast }) => {
  return createPortal(
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none w-full max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>,
    document.body
  );
};

const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: <CheckCircle2 className="text-green-500" />,
    error: <AlertCircle className="text-red-500" />,
    info: <Info className="text-blue-500" />,
    warning: <AlertTriangle className="text-amber-500" />
  };

  const bgStyles = {
    success: "bg-green-50 border-green-100",
    error: "bg-red-50 border-red-100",
    info: "bg-blue-50 border-blue-100",
    warning: "bg-amber-50 border-amber-100"
  };

  return (
    <div className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border-2 shadow-lg animate-in fade-in slide-in-from-right-10 duration-300 ${bgStyles[type] || bgStyles.info}`}>
      <div className="mt-0.5">{icons[type] || icons.info}</div>
      <div className="flex-1 text-sm font-medium text-slate-800">{message}</div>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
        <X size={16} />
      </button>
    </div>
  );
};

const NotificationModal = ({ title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'default' }) => {
  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-600 mb-6">{message}</p>
          <div className="flex gap-3 justify-end">
            <button 
              onClick={onCancel}
              className="px-4 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {cancelText}
            </button>
            <button 
              onClick={onConfirm}
              className={`px-6 py-2 rounded-lg font-bold text-white transition-all transform hover:scale-105 ${variant === 'destructive' ? 'bg-red-500 hover:bg-red-600' : 'bg-brand-blue hover:bg-brand-blue/90'}`}
              style={variant === 'default' ? { background: 'linear-gradient(90deg, #026CFF, #A135E2)' } : {}}
            >
              {confirmText}
            </button>
          </div>
        </div>
        <div className="h-1.5 w-full bg-slate-100 overflow-hidden">
          <div className={`h-full ${variant === 'destructive' ? 'bg-red-500' : 'bg-brand-blue'}`} style={variant === 'default' ? { background: 'linear-gradient(90deg, #026CFF, #A135E2)' } : {}}></div>
        </div>
      </div>
    </div>,
    document.body
  );
};
