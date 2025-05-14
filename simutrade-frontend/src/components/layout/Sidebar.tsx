import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  // Optional props
}

const Sidebar: React.FC<SidebarProps> = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="app-sidebar">
      <div className="sidebar-header">
        <img
          src="/simutrade-logo-full.svg"
          alt="Simutrade Logo"
          className="sidebar-logo"
        />
      </div>

      <div className="user-info">
        <div className="user-avatar">
          {/* Placeholder for user avatar */}
          <div className="avatar-placeholder">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
        <div className="user-details">
          <p className="user-name">{user?.name || 'User'}</p>
          <p className="user-email">{user?.email || 'user@example.com'}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? 'active' : '')}
              end
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/portfolio"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Portfolio
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/market"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Market
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/transactions"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Transactions
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Settings
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
