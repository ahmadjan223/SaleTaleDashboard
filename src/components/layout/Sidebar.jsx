import React from 'react';
import { VIEWS } from '../../constants/views';

const Sidebar = ({ activeView, onViewChange }) => (
  <nav className="sidebar">
    <div className="sidebar-header">
      {/* Sidebar title can be removed if top-bar has main title */}
    </div>
    <ul>
      <li onClick={() => onViewChange(VIEWS.HOME)} className={`${activeView === VIEWS.HOME ? 'active' : ''} sidebar-item`}>Home</li>
      <li className="sidebar-divider"></li>
      <li onClick={() => onViewChange(VIEWS.SALES)} className={`${activeView === VIEWS.SALES ? 'active' : ''} sidebar-item`}>Sales</li>
      <li onClick={() => onViewChange(VIEWS.PRODUCTS)} className={`${activeView === VIEWS.PRODUCTS ? 'active' : ''} sidebar-item`}>Products</li>
      <li onClick={() => onViewChange(VIEWS.RETAILERS)} className={`${activeView === VIEWS.RETAILERS ? 'active' : ''} sidebar-item`}>Retailers</li>
      <li onClick={() => onViewChange(VIEWS.SALESMEN)} className={`${activeView === VIEWS.SALESMEN ? 'active' : ''} sidebar-item`}>Salesmen</li>
    </ul>
  </nav>
);

export default Sidebar; 