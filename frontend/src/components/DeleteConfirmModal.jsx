import React from 'react';
import { AlertTriangle, X, Loader2, Trash2 } from 'lucide-react';
import { getInitials, getAvatarGradient } from './EmployeeCard';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, employee, isDeleting }) {
  if (!isOpen || !employee) return null;

  const initials = getInitials(employee.name);
  const avatarStyle = { background: getAvatarGradient(employee.name) };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge modal-icon-danger">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2 className="modal-title">Delete Employee</h2>
              <p className="modal-subtitle">Confirm removal of employee record</p>
            </div>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Close Modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Are you sure you want to delete this employee? This action is permanent and cannot be undone.
          </p>

          <div className="delete-summary-box">
            <div className="card-avatar" style={{ ...avatarStyle, width: '42px', height: '42px', fontSize: '0.95rem' }}>
              {initials}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <strong style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>
                {employee.name}
              </strong>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                {employee.designation} • {employee.department}
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>
                {employee.email}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            id="confirm-delete-btn"
            className="btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="spin-animation" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete Employee</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
