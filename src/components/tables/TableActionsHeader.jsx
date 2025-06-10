import React from 'react';

const TableActionsHeader = ({ onRefresh, children }) => (
  <div className="section-header-actions">
    {children}
    <button onClick={onRefresh} className="action-btn icon-btn refresh-btn" title="Refresh Data">🔄</button>
  </div>
);

export default TableActionsHeader; 