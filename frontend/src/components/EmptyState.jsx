import React from 'react';
import { SearchX, UserPlus, RotateCcw } from 'lucide-react';

export default function EmptyState({ isFiltered, onResetFilters, onOpenAddModal }) {
  if (isFiltered) {
    return (
      <div className="empty-state-card">
        <div className="empty-icon-circle">
          <SearchX size={36} />
        </div>
        <h3 className="empty-title">No employees found</h3>
        <p className="empty-desc">
          We couldn't find any employees matching your current search and filter criteria. Try adjusting your search query or reset the filters.
        </p>
        <button className="btn-secondary" onClick={onResetFilters} style={{ marginTop: '0.5rem' }}>
          <RotateCcw size={16} />
          <span>Clear Search & Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="empty-state-card">
      <div className="empty-icon-circle">
        <UserPlus size={36} />
      </div>
      <h3 className="empty-title">Directory is empty</h3>
      <p className="empty-desc">
        There are no employees registered in the directory yet. Click the button below to add your first team member!
      </p>
      <button className="btn-primary" onClick={onOpenAddModal} style={{ marginTop: '0.5rem' }}>
        <UserPlus size={16} />
        <span>Add First Employee</span>
      </button>
    </div>
  );
}
