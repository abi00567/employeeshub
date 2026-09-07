import React from 'react';
import { Users, UserPlus, RefreshCw, ShieldCheck } from 'lucide-react';

export default function Navbar({ onOpenAddModal, onRefresh, totalCount, isRefreshing }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand */}
        <div className="brand-section">
          <div className="brand-icon-wrapper">
            <Users size={24} strokeWidth={2.2} />
          </div>
          <div className="brand-title-group">
            <div className="brand-title">
              EmployeeHub
              <span className="brand-badge">Directory</span>
            </div>
            <span className="brand-tagline">Enterprise Workforce Management</span>
          </div>
        </div>

        {/* Actions */}
        <div className="nav-actions">
          <button
            className="btn-icon-only"
            title="Refresh Directory"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh Directory"
          >
            <RefreshCw size={18} className={isRefreshing ? 'spin-animation' : ''} />
          </button>

          <button
            id="add-employee-btn"
            className="btn-primary"
            onClick={onOpenAddModal}
            aria-label="Add New Employee"
          >
            <UserPlus size={18} />
            <span>Add Employee</span>
          </button>
        </div>
      </div>
    </header>
  );
}
