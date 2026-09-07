import React from 'react';
import { Search, X, LayoutGrid, List, ChevronDown, RotateCcw } from 'lucide-react';

const COMMON_DEPARTMENTS = [
  'All',
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Human Resources',
  'Finance',
];

export default function FilterBar({
  search,
  setSearch,
  selectedDepartment,
  setSelectedDepartment,
  viewMode,
  setViewMode,
  totalResults,
  allCount,
  availableDepartments = [],
}) {
  // Combine preset departments with any custom ones loaded from backend
  const departmentsList = [
    'All',
    ...Array.from(new Set([...COMMON_DEPARTMENTS.slice(1), ...availableDepartments])),
  ];

  const hasActiveFilters = search.trim() !== '' || selectedDepartment !== 'All';

  const handleResetFilters = () => {
    setSearch('');
    setSelectedDepartment('All');
  };

  return (
    <div className="filter-bar">
      {/* Top Filter Row */}
      <div className="filter-main-row">
        {/* Search Input */}
        <div className="search-box-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            id="search-input"
            className="search-input"
            placeholder="Search staff by name, email, role, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="search-clear-btn"
              onClick={() => setSearch('')}
              title="Clear search"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Controls: Department Dropdown & View Mode Switcher */}
        <div className="filter-controls">
          <div className="select-wrapper">
            <select
              id="department-select"
              className="custom-select"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              aria-label="Filter by department"
            >
              {departmentsList.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="select-arrow" />
          </div>

          {/* View Toggle */}
          <div className="view-toggle-group" role="group" aria-label="View Switcher">
            <button
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Cards Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
              aria-label="Table View"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Filter Department Pills */}
      <div className="dept-pills-row">
        {departmentsList.slice(0, 7).map((dept) => (
          <button
            key={dept}
            className={`dept-pill ${selectedDepartment === dept ? 'active' : ''}`}
            onClick={() => setSelectedDepartment(dept)}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Filter Summary & Reset */}
      <div className="filter-summary-row">
        <span>
          Showing <span className="filter-count-highlight">{totalResults}</span> of{' '}
          <span className="filter-count-highlight">{allCount}</span> total employees
        </span>

        {hasActiveFilters && (
          <button className="reset-filters-link" onClick={handleResetFilters}>
            <RotateCcw size={14} />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
