import React from 'react';
import { Layout, Input, Badge, Avatar, Dropdown, Menu, Space } from 'antd';
import {
  BellOutlined,
  UserOutlined,
  SearchOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Assuming useAuth provides logout and user info

const { Header: AntHeader } = Layout;

const DashboardHeader: React.FC = () => {
  const { user, logout } = useAuth(); // Adapt if user/logout comes from elsewhere

  const handleLogout = () => {
    logout();
    // Navigate to home or login should be handled by useAuth or a redirect mechanism
  };

  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/dashboard/profile">Profile</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link to="/dashboard/settings">Settings</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader className="dashboard-header">
      <div className="header-left">
        <Input.Search
          placeholder="Search..."
          className="header-search"
          prefix={<SearchOutlined />}
        />
      </div>
      <div className="header-right">
        <Badge count={5}>
          <BellOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
        </Badge>
        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
          <div className="user-dropdown">
            <Avatar icon={<UserOutlined />} src={user?.avatarUrl} />
            <span className="user-name">{user?.name || 'User'}</span>
          </div>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default DashboardHeader;
