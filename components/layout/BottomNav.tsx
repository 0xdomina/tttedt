import React from 'react';
import { useUIStore } from '../../store';
import { HomeIcon, SearchIcon, PlusCircleIcon, ChatBubbleIcon, UserCircleIcon } from '../Icons';
import type { Tab } from '../../store';

const NavItem: React.FC<{
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon: Icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
      isActive ? 'text-violet-600' : 'text-gray-500 hover:text-violet-500'
    }`}
    aria-label={label}
  >
    <Icon isActive={isActive} />
    <span className={`text-xs mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
  </button>
);

const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useUIStore();

  const navItems = [
    { tab: 'home' as Tab, label: 'Home', icon: HomeIcon },
    { tab: 'search' as Tab, label: 'Search', icon: SearchIcon },
    { tab: 'post' as Tab, label: 'Post', icon: PlusCircleIcon },
    { tab: 'messages' as Tab, label: 'Messages', icon: ChatBubbleIcon },
    { tab: 'profile' as Tab, label: 'Profile', icon: UserCircleIcon },
  ];

  return (
    <div className="md:hidden flex justify-around items-center bg-white/50 backdrop-blur-sm border-t border-gray-200 shadow-t-md fixed bottom-0 left-0 right-0 z-40">
      {navItems.map((item) => (
        <NavItem
          key={item.label}
          label={item.label}
          icon={item.icon}
          isActive={activeTab === item.tab}
          onClick={() => setActiveTab(item.tab)}
        />
      ))}
    </div>
  );
};

export default BottomNav;
