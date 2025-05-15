import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import Sidebar from '../components/layout/Sidebar';

const { Content } = Layout;

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const siderWidth = collapsed ? 80 : 200;

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }} className="dashboard-antd-layout">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout
        className="site-layout"
        style={{ marginLeft: siderWidth, transition: 'margin-left 0.2s' }}
      >
        <DashboardHeader />
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleSidebar}
          className="sidebar-toggle"
          style={{
            position: 'fixed',
            left: collapsed ? '80px' : '200px',
            top: '72px',
            zIndex: 100,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fff',
            border: 'none',
            fontSize: '16px',
            transition: 'left 0.2s ease',
            marginLeft: '-20px',
          }}
        />
        <Content className="dashboard-content">
          {children || <Outlet />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
