import React, { useEffect } from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import {
  HomeOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  TrophyOutlined,
  FileTextOutlined,
  GlobalOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

// Using URL references for public assets instead of imports
const logoOpen = '/logo.svg'; // Logo for expanded sidebar
const logoClosed = '/logo-border.svg'; // Logo for collapsed sidebar

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const location = useLocation();

  // Set sidebar to be closed by default on initial load
  useEffect(() => {
    if (collapsed === false) {
      // Only trigger this once on initial mount
      onCollapse(true);
    }
  }, []);

  // Main menu items
  const mainMenuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <HomeOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: 'trading',
      icon: <GlobalOutlined />,
      label: 'Trading',
      children: [
        {
          key: '/playground',
          label: <Link to="/playground">Simulation Playground</Link>,
        },
        {
          key: '/strategies',
          label: <Link to="/strategies">AI Strategies</Link>,
        },
      ],
    },
    {
      key: 'learning',
      icon: <TrophyOutlined />,
      label: 'Learning',
      children: [
        {
          key: '/missions',
          label: <Link to="/missions">Trade Missions</Link>,
        },
        {
          key: '/mentor',
          label: <Link to="/mentor">AI Trade Mentor</Link>,
        },
        {
          key: '/arena',
          label: <Link to="/arena">Global Trade Arena</Link>,
        },
      ],
    },
    {
      key: 'analytics',
      icon: <AppstoreOutlined />,
      label: 'Analytics',
      children: [
        {
          key: '/analytics/overview',
          label: <Link to="/analytics/overview">Overview</Link>,
        },
        {
          key: '/analytics/transaction',
          label: <Link to="/analytics/transaction">Transaction</Link>,
        },
        {
          key: '/analytics/projects',
          label: <Link to="/analytics/projects">Projects</Link>,
        },
      ],
    },
    {
      key: '/blueprints',
      icon: <FileTextOutlined />,
      label: <Link to="/blueprints">Export Blueprints</Link>,
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      breakpoint="lg"
      className="dashboard-sidebar"
      style={{
        backgroundColor: '#ffffff',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)',
      }}
      width={260}
      collapsedWidth={80}
      trigger={null}
    >
      <div
        className="logo-container"
        style={{
          padding: collapsed ? '16px' : '30px 0px 30px 16px',
          textAlign: collapsed ? 'center' : 'left',
          marginBottom: '10px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
        >
          <img
            src={collapsed ? logoClosed : logoOpen}
            alt="SimuTrade"
            style={{
              width: collapsed ? '42px' : '100%',
              height: collapsed ? '42px' : 'auto',
              maxWidth: '160px',
            }}
          />
        </div>
      </div>

      <div
        className="menu-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100% - 150px)',
          justifyContent: 'space-between',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <div>
          <div
            style={{
              padding: collapsed ? '10px 0' : '10px 0px 10px 16px',
              fontSize: '12px',
              color: '#888',
              textAlign: 'left',
              fontWeight: 700,
              letterSpacing: '0.5px',
            }}
          >
            {!collapsed && 'MAIN MENU'}
          </div>
          <Menu
            mode="inline"
            theme="light"
            items={mainMenuItems}
            selectedKeys={[location.pathname]}
            style={{
              border: 'none',
              textAlign: 'left',
            }}
            className="green-theme-menu"
          />
          <style>
            {`
              .green-theme-menu .ant-menu-item-selected {
                background-color: #e6f7e6 !important;
              }
              .green-theme-menu .ant-menu-item-selected,
              .green-theme-menu .ant-menu-item-selected a,
              .green-theme-menu .ant-menu-item-selected .anticon {
                color: #4CAF50 !important;
              }
              .green-theme-menu .ant-menu-item:hover,
              .green-theme-menu .ant-menu-submenu-title:hover {
                color: #4CAF50 !important;
              }
              .green-theme-menu .ant-menu-item:hover .anticon,
              .green-theme-menu .ant-menu-submenu-title:hover .anticon,
              .green-theme-menu .ant-menu-submenu-title:hover .ant-menu-submenu-arrow {
                color: #4CAF50 !important;
              }
              .green-theme-menu .ant-menu-submenu-selected .ant-menu-submenu-title {
                color: #4CAF50 !important;
              }
              .green-theme-menu .ant-menu-submenu-selected .ant-menu-submenu-title .anticon,
              .green-theme-menu .ant-menu-submenu-selected .ant-menu-submenu-title .ant-menu-submenu-arrow {
                color: #4CAF50 !important;
              }
              .ant-layout-sider-trigger {
                display: none !important;
              }
              .ant-menu-title-content {
                text-align: left !important;
              }
            `}
          </style>
        </div>
      </div>

      {/* Footer with toggle and logout positioned at the very bottom */}
      <div
        style={{
          padding: '0 16px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => onCollapse(!collapsed)}
          style={{
            marginBottom: '16px',
            color: '#4CAF50',
          }}
        />

        <Link to="/logout" style={{ width: '100%' }}>
          <Button
            icon={<LogoutOutlined />}
            danger
            type="primary"
            style={{ width: '100%' }}
          >
            {!collapsed && 'Logout'}
          </Button>
        </Link>
      </div>
    </Sider>
  );
};

export default Sidebar;
