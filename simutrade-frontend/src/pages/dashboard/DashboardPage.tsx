import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <p>Welcome back, {user?.name || 'User'}</p>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Portfolio Value</h3>
          <p className="stat-value">$10,345.67</p>
          <p className="stat-change positive">+2.5%</p>
        </div>
        
        <div className="stat-card">
          <h3>Open Positions</h3>
          <p className="stat-value">8</p>
        </div>
        
        <div className="stat-card">
          <h3>Today's P/L</h3>
          <p className="stat-value">$145.20</p>
          <p className="stat-change positive">+1.4%</p>
        </div>
      </div>
      
      <section className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <p className="activity-time">10:30 AM</p>
            <p className="activity-description">Bought 10 shares of AAPL at $172.35</p>
          </div>
          <div className="activity-item">
            <p className="activity-time">Yesterday</p>
            <p className="activity-description">Sold 5 shares of MSFT at $338.12</p>
          </div>
          <div className="activity-item">
            <p className="activity-time">Yesterday</p>
            <p className="activity-description">Dividend payment received: $12.50</p>
          </div>
        </div>
      </section>
      
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default DashboardPage; 