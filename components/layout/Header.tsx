
import React from 'react';
import { BellIcon, ArrowLeftIcon, MenuIcon } from '../Icons';

interface HeaderProps {
    title: string;
    unreadCount: number;
    onNotificationClick: () => void;
    showLogout?: boolean;
    onLogout?: () => void;
    showBack?: boolean;
    onBack?: () => void;
    onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, unreadCount, onNotificationClick, showLogout, onLogout, showBack, onBack, onMenuClick }) => {
    return (
        <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-30 p-4 flex justify-between items-center">
            <div className="w-16 flex items-center">
                {showBack ? (
                    <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                ) : (
                    <>
                        <div className="md:hidden">
                            <button onClick={onMenuClick} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                                <MenuIcon className="w-6 h-6" />
                            </button>
                        </div>
                        {title === "edQorta" && <h1 className="hidden md:block text-xl font-bold text-violet-600">{title}</h1>}
                    </>
                )}
            </div>
            
            <h1 className="text-xl font-bold text-gray-800 text-center truncate px-2">
              {title !== "edQorta" ? title : ''}
            </h1>
            
            <div className="w-16 flex items-center justify-end gap-2">
                {showLogout && (
                    <button onClick={onLogout} className="text-sm font-semibold text-red-500 hover:text-red-700">
                        Log Out
                    </button>
                )}
                <button onClick={onNotificationClick} className="relative p-2 rounded-full hover:bg-gray-100">
                    <BellIcon className="w-6 h-6 text-gray-600" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-xs items-center justify-center">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        </span>
                    )}
                </button>
            </div>
        </header>
    );
};

export default Header;
