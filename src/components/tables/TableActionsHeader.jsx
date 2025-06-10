import React from 'react';

const TableActionsHeader = () => {
  return (
    <div className="table-actions">
      <div className="search-box">
        <input type="text" placeholder="Search..." />
        <span className="search-icon">🔍</span>
      </div>
    </div>
  );
};

export default TableActionsHeader; 