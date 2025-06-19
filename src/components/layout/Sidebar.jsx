import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ open = true, onClose }) => (
  <nav className={`sidebar${open ? ' open' : ''}`}>
    <div className="sidebar-header">
      {/* Sidebar title can be removed if top-bar has main title */}
      <button
        className="sidebar-close-btn"
        onClick={onClose}
        aria-label="Close sidebar"
        style={{ display: 'none' }}
      >
        &times;
      </button>
    </div>
    <ul>
      <li>
        <NavLink 
          to="/admin" 
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          end
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          Home
        </NavLink>
      </li>
      <li className="sidebar-divider"></li>
      <li>
        <NavLink 
          to="/admin/sales" 
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          Sales
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/admin/products" 
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          Products
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/admin/retailers" 
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          Retailers
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/admin/salesmen" 
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          Salesmen
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/admin/franchises" 
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          Franchises
        </NavLink>
      </li>
      <li className="sidebar-divider"></li>
      <li>
        <NavLink 
          to="/admin/profile" 
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          Profile Settings
        </NavLink>
      </li>
    </ul>
  </nav>
);

export default Sidebar; 