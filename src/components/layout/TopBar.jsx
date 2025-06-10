import React from 'react';

const TopBar = ({ onHomeClick, onLogout }) => (
  <div className="top-bar">
    <div className="top-bar-title-container" onClick={onHomeClick}>
      <h1>SaleTale</h1>
      <p className="subline">Admin Dashboard</p>
    </div>
    <button onClick={onLogout} className="action-btn icon-btn logout-btn-icon" title="Logout">🚪<span style={{fontSize: '0.7em', verticalAlign: 'middle'}}>➡️</span></button>
  </div>
);

export default TopBar; 