import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts = [], onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map((toast) => {
        const type = toast.type || 'info';

        return (
          <div key={toast.id} className={`toast-item ${type}`} role="alert">
            <div className="toast-content">
              {type === 'success' && <CheckCircle2 size={18} style={{ color: '#34d399', flexShrink: 0 }} />}
              {type === 'error' && <AlertCircle size={18} style={{ color: '#fb7185', flexShrink: 0 }} />}
              {type === 'info' && <Info size={18} style={{ color: '#818cf8', flexShrink: 0 }} />}
              <span className="toast-text">{toast.message}</span>
            </div>
            <button
              className="toast-dismiss"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
