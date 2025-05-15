import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import Sidebar from '../components/layout/Sidebar';

const { Content } = Layout;

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }} className="dashboard-antd-layout">
      <Sidebar />
      <Layout className="site-layout">
        <DashboardHeader />
        <Content className="dashboard-content">
          {children || <Outlet />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
