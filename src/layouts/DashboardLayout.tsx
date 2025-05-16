import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import Sidebar from '../components/layout/Sidebar';

const { Content } = Layout;

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const siderWidth = collapsed ? 80 : 260;

  return (
    <Layout className="dashboard-layout-wrapper" style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout
        className="dashboard-main-layout"
        style={{
          marginLeft: siderWidth,
          transition: 'margin-left 0.2s',
          minHeight: '100vh',
        }}
      >
        <DashboardHeader />
        <Content
          className="dashboard-content-wrapper"
          style={{
            margin: '24px',
            padding: '24px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            minHeight: '280px',
            overflow: 'auto',
          }}
        >
          {children || <Outlet />}
        </Content>
      </Layout>

      <style>
        {`
          .dashboard-layout-wrapper {
            display: flex;
            flex-direction: row;
          }

          .dashboard-main-layout {
            display: flex;
            flex-direction: column;
            flex: 1;
          }

          .dashboard-header {
            position: sticky;
            top: 0;
            z-index: 10;
            width: 100%;
            padding: 0 24px;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
            background: white;
          }

          .dashboard-content-wrapper {
            flex: 1;
          }

          .dashboard-page {
            width: 100%;
          }

          @media (max-width: 768px) {
            .dashboard-content-wrapper {
              margin: 16px 8px !important;
              padding: 16px 8px !important;
            }
          }
        `}
      </style>
    </Layout>
  );
};

export default DashboardLayout;
