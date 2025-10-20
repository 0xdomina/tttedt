import React from 'react';
import { Tab } from '../../store';
import { User } from '../../types';
import { DashboardIcon, ShieldCheckIcon, CogIcon } from '../Icons';

interface NavItemConfig {
  tab: Tab;
  label: string;
  icon: React.ElementType;
}

interface SideNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  navItems: NavItemConfig[];
  currentUser: User;
  onNavigate: (view: 'dashboard' | 'verify' | 'settings') => void;
  onLogout: () => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon: Icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-4 w-full p-3 rounded-full transition-colors duration-200 ${
      isActive ? 'text-violet-600 bg-violet-100 font-bold' : 'text-gray-700 hover:bg-gray-100'
    }`}
    aria-label={label}
  >
    <Icon isActive={isActive} className="w-7 h-7" />
    <span className="text-lg">{label}</span>
  </button>
);

const SideNav: React.FC<SideNavProps> = ({ activeTab, setActiveTab, navItems, currentUser, onNavigate, onLogout }) => {
  const isBusiness = currentUser.accountType === 'business' && currentUser.businessStatus === 'verified';
  const isAgent = currentUser.agentStatus === 'verified';

  return (
    <div className="hidden md:flex flex-col w-64 p-4 border-r border-gray-200 h-screen sticky top-0 bg-white">
      <div className="text-2xl font-bold text-violet-600 mb-8 px-3">edQorta</div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            label={item.label}
            icon={item.icon}
            isActive={activeTab === item.tab}
            onClick={() => setActiveTab(item.tab)}
          />
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <nav className="space-y-2">
          {(isBusiness || isAgent) && (
            <NavItem
              label={isBusiness ? "Business Hub" : "Dashboard"}
              icon={DashboardIcon}
              isActive={false}
              onClick={() => onNavigate('dashboard')}
            />
          )}
          <NavItem
            label="Verify"
            icon={ShieldCheckIcon}
            isActive={false}
            onClick={() => onNavigate('verify')}
          />
          <NavItem
            label="Settings"
            icon={CogIcon}
            isActive={false}
            onClick={() => onNavigate('settings')}
          />
        </nav>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center gap-3">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full" loading="lazy" />
            <div>
              <p className="font-bold text-sm text-gray-800">{currentUser.name}</p>
              <p className="text-xs text-gray-500">@{currentUser.username}</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full text-left mt-4 py-2 px-3 text-red-600 font-semibold rounded-lg hover:bg-red-50 text-sm">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideNav;