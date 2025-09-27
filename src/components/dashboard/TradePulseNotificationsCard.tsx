import React from 'react';

interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
  category?: string;
}

interface TradePulseNotificationsCardProps {
  notifications: Notification[];
}

const TradePulseNotificationsCard: React.FC<TradePulseNotificationsCardProps> = ({ 
  notifications 
}) => {
  const defaultNotifications = [
    {
      id: 1,
      message: 'New import tariff changes for electronics in the EU.',
      time: '2h ago',
      read: false,
      category: 'Tariff Changes',
    },
    {
      id: 2,
      message: 'Port congestion reported in Shanghai, expect delays.',
      time: '5h ago',
      read: false,
      category: 'Logistics',
    },
    {
      id: 3,
      message: 'Webinar: "Navigating USMCA 2.0" next Tuesday.',
      time: '1 day ago',
      read: true,
      category: 'Events',
    },
  ];

  const displayNotifications = notifications.length > 0 ? notifications : defaultNotifications;

  return (
    <div className="bg-white border border-gray-200/60 rounded-xl p-6 h-full">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-lg font-medium text-gray-900">Trade Pulse Notifications</h3>
        <button className="text-sm text-primary hover:text-secondary-dark">
          View all →
        </button>
      </div>
      
      <div className="space-y-4">
        {displayNotifications.slice(0, 3).map((notification) => (
          <div key={notification.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
            <div className="mb-2">
              <div className="font-medium text-gray-900 text-sm leading-relaxed">
                {notification.message}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {notification.time}
              </span>
              {!notification.read && (
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradePulseNotificationsCard;
