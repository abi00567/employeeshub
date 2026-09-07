import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import FilterBar from './components/FilterBar';
import EmployeeCard from './components/EmployeeCard';
import EmployeeTable from './components/EmployeeTable';
import EmployeeModal from './components/EmployeeModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import LoadingSkeleton from './components/LoadingSkeleton';
import EmptyState from './components/EmptyState';
import Toast from './components/Toast';
import { api } from './services/api';
import { AlertCircle, RefreshCw } from 'lucide-react';
import './App.css';

export default function App() {
  // State
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Filters & Views
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const handleDismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch all employees and stats
  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setErrorMessage(null);

    try {
      const [empRes, statsRes] = await Promise.all([
        api.getEmployees(),
        api.getStats().catch(() => ({ data: null })),
      ]);

      if (empRes?.data) {
        setEmployees(empRes.data);
      }
      if (statsRes?.data) {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error('Failed to load employee directory:', err);
      setErrorMessage(err.message || 'Unable to connect to server. Please check your connection.');
      showToast('Could not load employees from server', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Derived filtered employees
  const filteredEmployees = useMemo(() => {
    const term = search.trim().toLowerCase();
    return employees.filter((emp) => {
      const matchesDept =
        selectedDepartment === 'All' ||
        emp.department.toLowerCase() === selectedDepartment.toLowerCase();

      if (!matchesDept) return false;

      if (!term) return true;

      const nameMatch = emp.name.toLowerCase().includes(term);
      const emailMatch = emp.email.toLowerCase().includes(term);
      const deptMatch = emp.department.toLowerCase().includes(term);
      const roleMatch = emp.designation.toLowerCase().includes(term);

      return nameMatch || emailMatch || deptMatch || roleMatch;
    });
  }, [employees, search, selectedDepartment]);

  // Available unique departments from current dataset
  const availableDepartments = useMemo(() => {
    return Array.from(new Set(employees.map((e) => e.department).filter(Boolean)));
  }, [employees]);

  // Handlers for Add/Edit Modal
  const handleOpenAddModal = () => {
    setEmployeeToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (employee) => {
    setEmployeeToEdit(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setEmployeeToEdit(null);
  };

  const handleSubmitEmployee = async (formData) => {
    setIsSubmitting(true);
    try {
      if (employeeToEdit) {
        // UPDATE PUT
        const res = await api.updateEmployee(employeeToEdit.employee_id, formData);
        setEmployees((prev) =>
          prev.map((item) =>
            item.employee_id === employeeToEdit.employee_id ? res.data : item
          )
        );
        showToast(`Updated '${formData.name}' successfully.`, 'success');
      } else {
        // CREATE POST
        const res = await api.createEmployee(formData);
        setEmployees((prev) => [res.data, ...prev]);
        showToast(`Added '${formData.name}' to directory.`, 'success');
      }

      // Refresh background stats
      api.getStats().then((s) => s?.data && setStats(s.data)).catch(() => {});
      setIsModalOpen(false);
      setEmployeeToEdit(null);
      return { success: true };
    } catch (err) {
      console.error('Save employee failed:', err);
      showToast(err.message || 'Failed to save employee record.', 'error');
      return {
        error: true,
        field: err.field,
        message: err.message,
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handlers for Delete Modal
  const handleOpenDeleteModal = (employee) => {
    setDeleteTarget(employee);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) return;
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await api.deleteEmployee(deleteTarget.employee_id);
      setEmployees((prev) =>
        prev.filter((e) => e.employee_id !== deleteTarget.employee_id)
      );
      showToast(`Deleted '${deleteTarget.name}' from directory.`, 'info');

      // Refresh background stats
      api.getStats().then((s) => s?.data && setStats(s.data)).catch(() => {});
      setDeleteTarget(null);
    } catch (err) {
      console.error('Delete employee failed:', err);
      showToast(err.message || 'Failed to delete employee.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const hasActiveFilters = search.trim() !== '' || selectedDepartment !== 'All';

  return (
    <div className="app-wrapper">
      {/* Top Navigation */}
      <Navbar
        onOpenAddModal={handleOpenAddModal}
        onRefresh={() => fetchData(true)}
        totalCount={employees.length}
        isRefreshing={isRefreshing}
      />

      {/* Main Page Container */}
      <main className="main-content">
        {/* Error Banner if any */}
        {errorMessage && (
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertCircle size={20} style={{ color: '#fb7185', flexShrink: 0 }} />
              <span style={{ fontSize: '0.9rem', color: '#fecdd3' }}>{errorMessage}</span>
            </div>
            <button className="btn-secondary" onClick={() => fetchData(false)} style={{ padding: '0.4rem 0.8rem' }}>
              <RefreshCw size={14} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Stats Metrics Cards */}
        <StatsOverview employees={employees} stats={stats} />

        {/* Filter, Search & View Controls */}
        <FilterBar
          search={search}
          setSearch={setSearch}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          viewMode={viewMode}
          setViewMode={setViewMode}
          totalResults={filteredEmployees.length}
          allCount={employees.length}
          availableDepartments={availableDepartments}
        />

        {/* Employee Directory Content */}
        {isLoading ? (
          <LoadingSkeleton viewMode={viewMode} count={viewMode === 'table' ? 6 : 6} />
        ) : filteredEmployees.length === 0 ? (
          <EmptyState
            isFiltered={hasActiveFilters && employees.length > 0}
            onResetFilters={() => {
              setSearch('');
              setSelectedDepartment('All');
            }}
            onOpenAddModal={handleOpenAddModal}
          />
        ) : viewMode === 'grid' ? (
          <div className="employee-grid">
            {filteredEmployees.map((emp) => (
              <EmployeeCard
                key={emp.employee_id}
                employee={emp}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
              />
            ))}
          </div>
        ) : (
          <EmployeeTable
            employees={filteredEmployees}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
          />
        )}
      </main>

      {/* Modals */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitEmployee}
        employeeToEdit={employeeToEdit}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        employee={deleteTarget}
        isDeleting={isDeleting}
      />

      {/* Floating Notifications */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
