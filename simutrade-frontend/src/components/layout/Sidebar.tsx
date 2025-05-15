import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import {
  DesktopOutlined,
  ExperimentOutlined, // For Playground
  MessageOutlined, // For Mentor
  ReadOutlined, // For Blueprints (or BookOutlined)
  RocketOutlined, // For Missions (or FlagOutlined, AimOutlined)
  // Add other icons as needed
} from '@ant-design/icons';

const { Sider } = Layout;

// Helper function to determine selected keys from path
const getSelectedKeys = (pathname: string) => {
  if (pathname.startsWith('/dashboard/playground'))
    return ['/dashboard/playground'];
  if (pathname.startsWith('/dashboard/missions'))
    return ['/dashboard/missions'];
  if (pathname.startsWith('/dashboard/mentor')) return ['/dashboard/mentor'];
  if (pathname.startsWith('/dashboard/blueprints'))
    return ['/dashboard/blueprints'];
  if (pathname.startsWith('/dashboard')) return ['/dashboard']; // Fallback for base dashboard
  return [];
};

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const selectedKeys = getSelectedKeys(location.pathname);

  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard/playground',
      icon: <ExperimentOutlined />,
      label: <Link to="/dashboard/playground">Playground</Link>,
    },
    {
      key: '/dashboard/missions',
      icon: <RocketOutlined />,
      label: <Link to="/dashboard/missions">Missions</Link>,
    },
    {
      key: '/dashboard/mentor',
      icon: <MessageOutlined />,
      label: <Link to="/dashboard/mentor">Mentor</Link>,
    },
    {
      key: '/dashboard/blueprints',
      icon: <ReadOutlined />,
      label: <Link to="/dashboard/blueprints">Blueprints</Link>,
    },
    {
      key: '/dashboard',
      icon: <DesktopOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      breakpoint="lg"
      className="dashboard-sidebar"
      style={{ background: 'red' }}
    >
      <div className="logo-app-name">{collapsed ? 'ST' : 'SimuTrade'}</div>
      <Menu
        theme="dark"
        selectedKeys={selectedKeys}
        mode="inline"
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar;
