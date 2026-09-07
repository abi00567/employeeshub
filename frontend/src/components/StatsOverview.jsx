import React from 'react';
import { Users, Building2, Briefcase, Activity } from 'lucide-react';

export default function StatsOverview({ employees = [], stats = null }) {
  const totalCount = stats?.totalEmployees ?? employees.length;
  const departments = stats?.departments ?? [...new Set(employees.map((e) => e.department))];
  const deptCount = stats?.departmentCount ?? departments.length;

  // Calculate top department
  let topDept = 'N/A';
  let maxCount = 0;
  if (stats?.departmentCounts) {
    for (const [dept, count] of Object.entries(stats.departmentCounts)) {
      if (count > maxCount) {
        maxCount = count;
        topDept = dept;
      }
    }
  } else if (employees.length > 0) {
    const counts = {};
    employees.forEach((e) => {
      counts[e.department] = (counts[e.department] || 0) + 1;
      if (counts[e.department] > maxCount) {
        maxCount = counts[e.department];
        topDept = e.department;
      }
    });
  }

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">Total Staff</span>
          <span className="stat-value">{totalCount}</span>
        </div>
        <div className="stat-icon-wrapper stat-icon-blue">
          <Users size={24} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">Departments</span>
          <span className="stat-value">{deptCount}</span>
        </div>
        <div className="stat-icon-wrapper stat-icon-purple">
          <Building2 size={24} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">Largest Department</span>
          <span className="stat-value" style={{ fontSize: '1.25rem', marginTop: '0.25rem' }}>
            {topDept}
          </span>
        </div>
        <div className="stat-icon-wrapper stat-icon-cyan">
          <Briefcase size={24} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">System Status</span>
          <span className="stat-value" style={{ fontSize: '1.15rem', color: '#34d399', marginTop: '0.25rem' }}>
            Live & Synced
          </span>
        </div>
        <div className="stat-icon-wrapper stat-icon-emerald">
          <Activity size={24} />
        </div>
      </div>
    </div>
  );
}
