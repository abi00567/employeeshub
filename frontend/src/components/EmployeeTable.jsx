import React from 'react';
import { Mail, Edit3, Trash2 } from 'lucide-react';
import { getInitials, getAvatarGradient, getDeptBadgeClass } from './EmployeeCard';

export default function EmployeeTable({ employees = [], onEdit, onDelete }) {
  return (
    <div className="table-container">
      <div className="table-responsive-wrapper">
        <table className="employee-data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Email</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => {
              const initials = getInitials(employee.name);
              const avatarStyle = { background: getAvatarGradient(employee.name) };
              const badgeClass = getDeptBadgeClass(employee.department);

              return (
                <tr key={employee.employee_id}>
                  {/* User Avatar + Name */}
                  <td>
                    <div className="table-user-cell">
                      <div className="table-avatar" style={avatarStyle}>
                        {initials}
                      </div>
                      <div className="table-user-info">
                        <span className="table-user-name">{employee.name}</span>
                        <span className="table-user-id">ID: #{employee.employee_id}</span>
                      </div>
                    </div>
                  </td>

                  {/* Designation */}
                  <td>
                    <span style={{ fontWeight: 500 }}>{employee.designation}</span>
                  </td>

                  {/* Department Badge */}
                  <td>
                    <span className={`dept-badge ${badgeClass}`}>
                      {employee.department}
                    </span>
                  </td>

                  {/* Email */}
                  <td>
                    <a
                      href={`mailto:${employee.email}`}
                      className="table-email-link"
                      title={`Send email to ${employee.email}`}
                    >
                      <Mail size={14} />
                      <span>{employee.email}</span>
                    </a>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="table-actions">
                      <button
                        className="action-btn-edit"
                        title="Edit Employee"
                        onClick={() => onEdit(employee)}
                        aria-label={`Edit ${employee.name}`}
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        className="action-btn-delete"
                        title="Delete Employee"
                        onClick={() => onDelete(employee)}
                        aria-label={`Delete ${employee.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
