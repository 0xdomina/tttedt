import React from 'react';
import { User } from '../../types';
import { DashboardIcon, ShieldCheckIcon, CogIcon } from '../Icons';

interface MobileSideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: 'dashboard' | 'verify' | 'settings') => void;
  onLogout: () => void;
  currentUser: User;
}

const NavItem: React.FC<{ label: string; icon: React.ElementType; onClick: () => void; }> = ({ label, icon: Icon, onClick }) => (
    <button onClick={onClick} className="flex items-center gap-4 w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors">
        <Icon className="w-6 h-6 text-gray-600" />
        <span className="font-semibold text-gray-700">{label}</span>
    </button>
);

const MobileSideMenu: React.FC<MobileSideMenuProps> = ({ isOpen, onClose, onNavigate, onLogout, currentUser }) => {
  const isBusiness = currentUser.accountType === 'business' && currentUser.businessStatus === 'verified';
  const isAgent = currentUser.agentStatus === 'verified';
  
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div 
        className={`fixed top-0 left-0 bottom-0 w-72 bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-12 h-12 rounded-full" loading="lazy" />
                <div>
                    <p className="font-bold text-gray-800">{currentUser.name}</p>
                    <p className="text-sm text-gray-500">@{currentUser.username}</p>
                </div>
            </div>
        </div>
        <nav className="p-4 space-y-2">
            {isBusiness && (
                <NavItem label="Business Hub" icon={DashboardIcon} onClick={() => onNavigate('dashboard')} />
            )}
            {isAgent && !isBusiness && (
                <NavItem label="Dashboard" icon={DashboardIcon} onClick={() => onNavigate('dashboard')} />
            )}
            <NavItem label="Verify" icon={ShieldCheckIcon} onClick={() => onNavigate('verify')} />
            <NavItem label="Settings" icon={CogIcon} onClick={() => onNavigate('settings')} />
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <button onClick={onLogout} className="w-full text-left py-2 px-3 text-red-600 font-semibold rounded-lg hover:bg-red-50">
                Log Out
            </button>
        </div>
      </div>
    </>
  );
};

export default MobileSideMenu;