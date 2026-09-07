import React from 'react';
import { Mail, Briefcase, Edit3, Trash2 } from 'lucide-react';

// Generates consistent initials from name
function getInitials(name = '') {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Generates consistent avatar gradient based on name hash
function getAvatarGradient(name = '') {
  const gradients = [
    'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
    'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

// Maps department name to appropriate badge CSS class
function getDeptBadgeClass(department = '') {
  const normalized = department.toLowerCase().replace(/[\s_]+/g, '-');
  if (normalized.includes('eng')) return 'dept-badge-engineering';
  if (normalized.includes('prod')) return 'dept-badge-product';
  if (normalized.includes('des')) return 'dept-badge-design';
  if (normalized.includes('market') || normalized.includes('mkt')) return 'dept-badge-marketing';
  if (normalized.includes('hr') || normalized.includes('human')) return 'dept-badge-human-resources';
  if (normalized.includes('fin')) return 'dept-badge-finance';
  return 'dept-badge-other';
}

export default function EmployeeCard({ employee, onEdit, onDelete }) {
  const initials = getInitials(employee.name);
  const avatarStyle = { background: getAvatarGradient(employee.name) };
  const badgeClass = getDeptBadgeClass(employee.department);

  return (
    <div className="employee-card">
      <div>
        {/* Header with Avatar and Name */}
        <div className="card-header">
          <div className="card-avatar-group">
            <div className="card-avatar" style={avatarStyle}>
              {initials}
            </div>
            <div className="card-user-info">
              <h3 className="card-user-name">{employee.name}</h3>
              <span className="card-user-id">ID: #{employee.employee_id}</span>
            </div>
          </div>
        </div>

        {/* Designation & Email */}
        <div className="card-details" style={{ marginTop: '1rem' }}>
          <div className="card-role-title">
            <Briefcase size={16} style={{ color: '#818cf8', flexShrink: 0 }} />
            <span>{employee.designation}</span>
          </div>

          <a
            href={`mailto:${employee.email}`}
            className="card-email-link"
            title={`Send email to ${employee.email}`}
          >
            <Mail size={15} style={{ flexShrink: 0 }} />
            <span>{employee.email}</span>
          </a>
        </div>
      </div>

      {/* Footer with Department Badge & Actions */}
      <div className="card-footer">
        <span className={`dept-badge ${badgeClass}`}>
          {employee.department}
        </span>

        <div className="card-actions">
          <button
            className="action-btn-edit"
            title="Edit Employee"
            onClick={() => onEdit(employee)}
            aria-label={`Edit ${employee.name}`}
          >
            <Edit3 size={16} />
          </button>
          <button
            className="action-btn-delete"
            title="Delete Employee"
            onClick={() => onDelete(employee)}
            aria-label={`Delete ${employee.name}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export { getInitials, getAvatarGradient, getDeptBadgeClass };
