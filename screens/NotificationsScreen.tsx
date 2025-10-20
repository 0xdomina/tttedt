import React from 'react';
import { Notification } from '../types';
import { ArrowLeftIcon, MessageCircleIcon, CheckCircleIcon, ClipboardListIcon, BellIcon, UserPlusIcon, HeartIcon, CalendarIcon } from '../components/Icons';
import { useUIStore } from '../store';
import { useGetNotifications } from '../hooks/useData';

const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
};

const NotificationIcon: React.FC<{ type: Notification['type'] }> = ({ type }) => {
    switch (type) {
        case 'message': return <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"><MessageCircleIcon className="w-5 h-5 text-blue-600" /></div>;
        case 'verification': return <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"><CheckCircleIcon className="w-5 h-5 text-green-600" /></div>;
        case 'deal': return <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0"><ClipboardListIcon className="w-5 h-5 text-violet-600" /></div>;
        case 'follow': return <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0"><UserPlusIcon className="w-5 h-5 text-indigo-600" /></div>;
        case 'like': return <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0"><HeartIcon className="w-5 h-5 text-red-600" /></div>;
        case 'tour': return <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0"><CalendarIcon className="w-5 h-5 text-orange-600" /></div>;
        default: return <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"><BellIcon className="w-5 h-5 text-gray-600" /></div>;
    }
};

const NotificationsScreen: React.FC = () => {
  const { data: notificationsData } = useGetNotifications();
  const notifications = notificationsData || [];
  const { closeFullScreen } = useUIStore();

  const handleNotificationClick = (notification: Notification) => {
      console.log('Notification clicked:', notification);
      // In a real app, you would navigate based on the notification type and relatedId
      // e.g., if (notification.type === 'message') setActiveTab('messages');
      closeFullScreen();
  };
    
  return (
    <div className="absolute inset-0 z-30 flex flex-col h-full bg-white w-full max-w-2xl mx-auto md:border-x md:border-gray-200">
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-gray-200 p-4 flex items-center space-x-4">
        <button onClick={closeFullScreen} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Notifications</h1>
      </header>
      
      <main className="flex-grow overflow-y-auto no-scrollbar">
        {notifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
                {notifications.map(notification => (
                    <button 
                        key={notification.id} 
                        onClick={() => handleNotificationClick(notification)}
                        className={`w-full text-left flex items-start space-x-4 p-4 transition-colors ${!notification.read ? 'bg-violet-50/50' : 'bg-white hover:bg-gray-50'}`}
                    >
                        <NotificationIcon type={notification.type} />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800">{notification.message}</p>
                            <p className={`text-xs mt-1 ${!notification.read ? 'text-violet-600 font-semibold' : 'text-gray-500'}`}>{timeAgo(notification.timestamp)}</p>
                        </div>
                        {!notification.read && (
                            <div className="w-2.5 h-2.5 bg-violet-500 rounded-full self-center flex-shrink-0 ml-2"></div>
                        )}
                    </button>
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <BellIcon className="w-16 h-16 text-gray-300" />
                <h2 className="mt-4 text-xl font-semibold text-gray-700">No Notifications Yet</h2>
                <p className="mt-2 text-gray-500">Important updates about your activity on edQorta will appear here.</p>
            </div>
        )}
      </main>
    </div>
  );
};

export default NotificationsScreen;
