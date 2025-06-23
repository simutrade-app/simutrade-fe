import React, { useState, useEffect } from 'react';
import { Layout, Input, Badge, Avatar, Dropdown, Tooltip, Divider } from 'antd';
import {
  BellOutlined,
  UserOutlined,
  SearchOutlined,
  SettingOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  BookOutlined,
  DashboardOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '@/services/AuthService';
import type { MenuProps } from 'antd';

const { Header: AntHeader } = Layout;

// Notification data type
interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const DashboardHeader: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [userData, setUserData] = useState<any>(null);

  // Fetch user data from token
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserData(user);
      console.log('User data loaded in header:', user);
    }
  }, []);

  // Mock notifications - in real app, would come from a notification service/context
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Trade Executed',
      message: 'Your order to buy 10 shares of AAPL was executed successfully',
      time: '10 minutes ago',
      read: false,
    },
    {
      id: '2',
      title: 'New Mission Available',
      message: 'A new trading mission is available in your dashboard',
      time: '2 hours ago',
      read: false,
    },
    {
      id: '3',
      title: 'Portfolio Update',
      message: 'Your portfolio has increased by 2.5% today',
      time: 'Yesterday',
      read: true,
    },
  ]);

  // Handle notification click
  const handleNotificationClick = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  // Get unread notification count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Handle search input change
  const handleSearch = (value: string) => {
    setSearchValue(value);
    // In a real app, this would trigger a search action/API call
    console.log('Searching for:', value);
  };

  // User dropdown menu items
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      label: (
        <div className="user-info-item">
          <div className="user-info-name">{userData?.name || 'User'}</div>
          <div className="user-info-email">
            {userData?.email || 'user@example.com'}
          </div>
        </div>
      ),
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
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
      key: 'api-keys',
      icon: <KeyOutlined />,
      label: <Link to="/dashboard/api-keys">API Keys</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'help',
      icon: <QuestionCircleOutlined />,
      label: <Link to="/help">Help Center</Link>,
    },
    {
      key: 'documentation',
      icon: <BookOutlined />,
      label: <Link to="/docs">Documentation</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: logoutUser,
      danger: true,
    },
  ];

  // Notification menu content
  const notificationMenu = (
    <div className="notification-dropdown">
      <div className="notification-header">
        <h3>Notifications</h3>
        {unreadCount > 0 && (
          <span className="mark-read" onClick={markAllAsRead}>
            Mark all as read
          </span>
        )}
      </div>
      <div className="notification-list">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
              onClick={() => handleNotificationClick(notification.id)}
            >
              <div className="notification-content">
                <div className="notification-title">{notification.title}</div>
                <div className="notification-message">
                  {notification.message}
                </div>
                <div className="notification-time">{notification.time}</div>
              </div>
              {!notification.read && <div className="unread-indicator" />}
            </div>
          ))
        ) : (
          <div className="empty-notifications">No notifications</div>
        )}
      </div>
      <div className="notification-footer">
        <Link to="/dashboard/notifications">View All Notifications</Link>
      </div>
    </div>
  );

  return (
    <>
      <AntHeader className="dashboard-header">
        <div className="header-container">
          <div className="header-left">
            <Input.Search
              placeholder="Find export rules, tariffs, or trade routes…"
              className="header-search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearch={handleSearch}
              prefix={<SearchOutlined />}
              allowClear
            />
          </div>
          <div className="header-right">
            <Tooltip title="Help">
              <QuestionCircleOutlined className="header-icon" />
            </Tooltip>

            <Dropdown
              menu={{ items: [] }}
              popupRender={() => notificationMenu}
              trigger={['click']}
              placement="bottomRight"
              arrow={{ pointAtCenter: true }}
            >
              <Badge count={unreadCount} offset={[-5, 5]}>
                <BellOutlined className="header-icon notification-icon" />
              </Badge>
            </Dropdown>

            <Divider type="vertical" className="header-divider" />

            <Dropdown
              menu={{ items: userMenuItems }}
              trigger={['click']}
              placement="bottomRight"
              arrow={{ pointAtCenter: true }}
            >
              <div className="user-dropdown">
                <Avatar
                  icon={<UserOutlined />}
                  src={userData?.avatarUrl}
                  size="default"
                  className="user-avatar"
                />
                <span className="user-name">{userData?.name || 'User'}</span>
              </div>
            </Dropdown>
          </div>
        </div>
      </AntHeader>

      {/* Add CSS for header components */}
      <style>
        {`
          .dashboard-header {
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
            padding: 0 24px;
            background: white;
            height: 64px;
            line-height: 64px;
            position: sticky;
            top: 0;
            z-index: 500;
          }

          .header-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100%;
          }

          .header-search {
            width: 320px;
            transition: width 0.3s;
          }

          .header-left {
            display: flex;
            align-items: center;
          }

          .header-right {
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .header-icon {
            font-size: 20px;
            color: #666;
            cursor: pointer;
            padding: 4px;
            transition: color 0.3s;
          }

          .header-icon:hover {
            color: #4CAF50;
          }

          .notification-icon {
            font-size: 20px;
          }

          .header-divider {
            height: 24px;
            margin: 0 8px;
          }

          .user-dropdown {
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 4px 8px;
            border-radius: 4px;
            transition: background-color 0.3s;
          }

          .user-dropdown:hover {
            background-color: rgba(0, 0, 0, 0.03);
          }

          .user-avatar {
            border: 2px solid transparent;
            transition: border-color 0.3s;
          }

          .user-dropdown:hover .user-avatar {
            border-color: #4CAF50;
          }

          .user-name {
            font-weight: 500;
            color: #333;
            white-space: nowrap;
          }

          .user-info-item {
            padding: 8px 0;
          }

          .user-info-name {
            font-weight: 500;
            font-size: 14px;
          }

          .user-info-email {
            color: #999;
            font-size: 12px;
          }

          /* Notification Dropdown Styles */
          .notification-dropdown {
            width: 360px;
            background: white;
            border-radius: 4px;
            box-shadow: 0 6px 16px -8px rgba(0, 0, 0, 0.08),
                        0 9px 28px 0 rgba(0, 0, 0, 0.05),
                        0 12px 48px 16px rgba(0, 0, 0, 0.03);
            overflow: hidden;
          }

          .notification-header {
            padding: 12px 16px;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .notification-header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 500;
          }

          .mark-read {
            color: #4CAF50;
            font-size: 12px;
            cursor: pointer;
          }

          .notification-list {
            max-height: 360px;
            overflow-y: auto;
          }

          .notification-item {
            padding: 12px 16px;
            border-bottom: 1px solid #f0f0f0;
            cursor: pointer;
            position: relative;
            transition: background-color 0.3s;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }

          .notification-item:hover {
            background-color: rgba(0, 0, 0, 0.02);
          }

          .notification-item.unread {
            background-color: rgba(76, 175, 80, 0.05);
          }

          .notification-content {
            flex: 1;
          }

          .notification-title {
            font-weight: 500;
            font-size: 14px;
            margin-bottom: 4px;
          }

          .notification-message {
            color: #666;
            font-size: 12px;
            margin-bottom: 4px;
          }

          .notification-time {
            color: #999;
            font-size: 11px;
          }

          .unread-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #4CAF50;
            margin-left: 8px;
          }

          .empty-notifications {
            padding: 24px;
            text-align: center;
            color: #999;
          }

          .notification-footer {
            padding: 12px 16px;
            text-align: center;
            border-top: 1px solid #f0f0f0;
          }

          .notification-footer a {
            color: #4CAF50;
            font-size: 13px;
          }

          /* Responsive styles */
          @media (max-width: 768px) {
            .dashboard-header {
              padding: 0 16px;
            }

            .header-search {
              width: 180px;
            }

            .user-name {
              display: none;
            }

            .notification-dropdown {
              width: 300px;
            }
          }

          @media (max-width: 576px) {
            .header-search {
              width: 140px;
            }

            .header-divider {
              display: none;
            }

            .notification-dropdown {
              width: 260px;
            }
          }
        `}
      </style>
    </>
  );
};

export default DashboardHeader;
