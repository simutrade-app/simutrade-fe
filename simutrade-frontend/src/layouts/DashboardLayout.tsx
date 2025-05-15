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

  const siderWidth = collapsed ? 80 : 200;

  return (
    <Layout style={{ minHeight: '100vh' }} className="dashboard-antd-layout">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout
        className="site-layout"
        style={{ marginLeft: siderWidth, transition: 'margin-left 0.2s' }}
      >
        <DashboardHeader />
        <Content className="dashboard-content">
          {children || <Outlet />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
