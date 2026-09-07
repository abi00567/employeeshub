import React, { useState, useEffect } from 'react';
import { X, User, Mail, Building, Briefcase, UserPlus, Edit3, Loader2 } from 'lucide-react';

const DEPARTMENT_OPTIONS = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Human Resources',
  'Finance',
  'Operations',
  'Sales',
  'Customer Support',
  'Legal',
];

export default function EmployeeModal({ isOpen, onClose, onSubmit, employeeToEdit, isSubmitting }) {
  const isEditMode = Boolean(employeeToEdit);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Engineering',
    designation: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        name: employeeToEdit.name || '',
        email: employeeToEdit.email || '',
        department: employeeToEdit.department || 'Engineering',
        designation: employeeToEdit.designation || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        department: 'Engineering',
        designation: '',
      });
    }
    setErrors({});
  }, [employeeToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      errs.name = 'Employee name is required.';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.department.trim()) {
      errs.department = 'Department is required.';
    }

    if (!formData.designation.trim()) {
      errs.designation = 'Designation is required.';
    } else if (formData.designation.trim().length < 2) {
      errs.designation = 'Designation must be at least 2 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await onSubmit(formData);
    // If backend returned error (e.g. duplicate email)
    if (result?.error && result.field) {
      setErrors((prev) => ({ ...prev, [result.field]: result.message }));
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              {isEditMode ? <Edit3 size={20} /> : <UserPlus size={20} />}
            </div>
            <div>
              <h2 className="modal-title">
                {isEditMode ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <p className="modal-subtitle">
                {isEditMode
                  ? `Update information for ${employeeToEdit?.name}`
                  : 'Enter details to register a new team member'}
              </p>
            </div>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close Modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="emp-name">
                <span>Full Name</span>
                <span className="form-label-required">*</span>
              </label>
              <div className="form-input-wrapper">
                <User size={18} className="form-input-icon" />
                <input
                  id="emp-name"
                  name="name"
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>
              {errors.name && <span className="form-error-msg">{errors.name}</span>}
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label className="form-label" htmlFor="emp-email">
                <span>Email Address</span>
                <span className="form-label-required">*</span>
              </label>
              <div className="form-input-wrapper">
                <Mail size={18} className="form-input-icon" />
                <input
                  id="emp-email"
                  name="email"
                  type="email"
                  placeholder="e.g. sarah.jenkins@company.com"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && <span className="form-error-msg">{errors.email}</span>}
            </div>

            {/* Department */}
            <div className="form-group">
              <label className="form-label" htmlFor="emp-department">
                <span>Department</span>
                <span className="form-label-required">*</span>
              </label>
              <div className="form-input-wrapper">
                <Building size={18} className="form-input-icon" />
                <select
                  id="emp-department"
                  name="department"
                  className={`form-input custom-select ${errors.department ? 'error' : ''}`}
                  value={formData.department}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  {DEPARTMENT_OPTIONS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              {errors.department && <span className="form-error-msg">{errors.department}</span>}
            </div>

            {/* Designation */}
            <div className="form-group">
              <label className="form-label" htmlFor="emp-designation">
                <span>Designation / Role Title</span>
                <span className="form-label-required">*</span>
              </label>
              <div className="form-input-wrapper">
                <Briefcase size={18} className="form-input-icon" />
                <input
                  id="emp-designation"
                  name="designation"
                  type="text"
                  placeholder="e.g. Lead Full-Stack Architect"
                  className={`form-input ${errors.designation ? 'error' : ''}`}
                  value={formData.designation}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              {errors.designation && <span className="form-error-msg">{errors.designation}</span>}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-employee-btn"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="spin-animation" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditMode ? 'Update Employee' : 'Save Employee'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
