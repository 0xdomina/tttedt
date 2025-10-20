import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ShieldExclamationIcon, InformationCircleIcon } from '../Icons';
import type { Notification as NotificationType } from '../../store';

interface NotificationProps extends NotificationType {
  onDismiss: () => void;
}

const icons = {
  success: <CheckCircleIcon className="w-6 h-6 text-white" />,
  error: <ShieldExclamationIcon className="w-6 h-6 text-white" />,
  info: <InformationCircleIcon className="w-6 h-6 text-white" />,
};

const bgColors = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
};

const Notification: React.FC<NotificationProps> = ({ id, message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000); // Auto-dismiss after 4 seconds

    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, x: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, x: 50, scale: 0.8, transition: { duration: 0.2 } }}
      className={`relative flex items-center gap-3 w-80 p-3 rounded-lg shadow-lg text-white ${bgColors[type]}`}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-grow text-sm font-medium">{message}</p>
      <button onClick={onDismiss} className="flex-shrink-0 font-bold text-lg opacity-70 hover:opacity-100">&times;</button>
    </motion.div>
  );
};

export default Notification;