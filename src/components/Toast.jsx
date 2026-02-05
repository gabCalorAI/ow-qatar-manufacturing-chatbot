import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            removeToast(id);
        }, 3000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`
                            px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md animate-slideIn
                            flex items-center gap-3 min-w-[300px]
                            ${toast.type === 'error' 
                                ? 'bg-red-500/10 border-red-500/20 text-red-200' 
                                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'}
                        `}
                    >
                        <span className={`
                            flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
                            ${toast.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}
                        `}>
                            {toast.type === 'error' ? '!' : '✓'}
                        </span>
                        <span className="text-sm font-medium">{toast.message}</span>
                        <button 
                            onClick={() => removeToast(toast.id)}
                            className="ml-auto opacity-50 hover:opacity-100 transition-opacity"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
