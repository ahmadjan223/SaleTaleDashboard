import React from 'react';

const TopBar = ({ onHomeClick, onSidebarToggle }) => (
  <div className="top-bar">
    <button
      className="sidebar-toggle-btn"
      onClick={onSidebarToggle}
      aria-label="Toggle sidebar"
      style={{ display: 'none' }}
    >
      <span className="hamburger-icon">&#9776;</span>
    </button>
    <div className="top-bar-title-container" onClick={onHomeClick}>
      {/* <h1>SaleTale</h1> */}
      <h1>Babar Brothers</h1>
    </div>
  </div>
);

export default TopBar; 