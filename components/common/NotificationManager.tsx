import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../store';
import Notification from './Notification';

const NotificationManager: React.FC = () => {
  const { notifications, dismissNotification } = useUIStore();

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            {...notification}
            onDismiss={() => dismissNotification(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationManager;