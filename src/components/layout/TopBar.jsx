import React from 'react';

const TopBar = ({ onHomeClick }) => (
  <div className="top-bar">
    <div className="top-bar-title-container" onClick={onHomeClick}>
      {/* <h1>SaleTale</h1> */}
      <h1>Babar Brothers</h1>
    </div>
  </div>
);

export default TopBar; 