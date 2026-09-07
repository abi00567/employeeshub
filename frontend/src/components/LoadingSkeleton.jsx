import React from 'react';

export default function LoadingSkeleton({ viewMode = 'grid', count = 6 }) {
  if (viewMode === 'table') {
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
              {Array.from({ length: count }).map((_, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="table-user-cell">
                      <div className="skeleton-box" style={{ width: 40, height: 40, borderRadius: 10 }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div className="skeleton-box" style={{ width: 140, height: 16 }} />
                        <div className="skeleton-box" style={{ width: 60, height: 12 }} />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="skeleton-box" style={{ width: 160, height: 16 }} />
                  </td>
                  <td>
                    <div className="skeleton-box" style={{ width: 90, height: 24, borderRadius: 20 }} />
                  </td>
                  <td>
                    <div className="skeleton-box" style={{ width: 180, height: 16 }} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <div className="skeleton-box" style={{ width: 32, height: 32, borderRadius: 6 }} />
                      <div className="skeleton-box" style={{ width: 32, height: 32, borderRadius: 6 }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Grid view skeletons
  return (
    <div className="employee-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="employee-card" style={{ minHeight: '210px' }}>
          <div>
            <div className="card-header">
              <div className="card-avatar-group">
                <div className="skeleton-box" style={{ width: 52, height: 52, borderRadius: 14 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="skeleton-box" style={{ width: 130, height: 18 }} />
                  <div className="skeleton-box" style={{ width: 60, height: 12 }} />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="skeleton-box" style={{ width: '80%', height: 16 }} />
              <div className="skeleton-box" style={{ width: '65%', height: 14 }} />
            </div>
          </div>

          <div className="card-footer">
            <div className="skeleton-box" style={{ width: 90, height: 24, borderRadius: 20 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <div className="skeleton-box" style={{ width: 34, height: 34, borderRadius: 8 }} />
              <div className="skeleton-box" style={{ width: 34, height: 34, borderRadius: 8 }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
