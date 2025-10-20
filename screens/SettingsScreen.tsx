import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon, UserCircleIcon, KeyIcon, ShieldCheckIcon, GiftIcon } from '../components/Icons';
import { useUIStore } from '../store';
import type { SettingsScreenView } from '../store';

const SettingsItem: React.FC<{ label: string; icon: React.ElementType; onClick?: () => void }> = ({ label, icon: Icon, onClick }) => (
    <button onClick={onClick} className="w-full text-left flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-4">
            <Icon className="w-6 h-6 text-gray-500" />
            <span className="text-gray-800 font-medium">{label}</span>
        </div>
        <ArrowRightIcon className="w-5 h-5 text-gray-400" />
    </button>
);

const SettingsScreen: React.FC = () => {
  const { closeFullScreen, setSettingsView } = useUIStore();
  const onNavigate = (view: SettingsScreenView | 'referral') => setSettingsView(view);

  return (
    <div className="absolute inset-0 bg-white z-40 flex flex-col">
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-gray-200 p-4 flex items-center space-x-4">
        <button onClick={closeFullScreen} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Settings</h1>
      </header>
      
      <main className="flex-grow overflow-y-auto no-scrollbar">
        <div className="py-2">
            <h3 className="px-4 pt-4 pb-2 text-sm font-semibold text-gray-500 uppercase">Account</h3>
            <div className="divide-y divide-gray-100">
                <SettingsItem label="Edit Profile" icon={UserCircleIcon} onClick={() => onNavigate('editProfile')} />
                <SettingsItem label="Change Password" icon={KeyIcon} onClick={() => onNavigate('changePassword')} />
                <SettingsItem label="Privacy and Security" icon={ShieldCheckIcon} onClick={() => onNavigate('privacy')} />
            </div>
        </div>
        <div className="py-2 mt-4">
            <h3 className="px-4 pt-4 pb-2 text-sm font-semibold text-gray-500 uppercase">Rewards</h3>
            <div className="divide-y divide-gray-100">
                <SettingsItem label="Refer & Earn" icon={GiftIcon} onClick={() => onNavigate('referral')} />
            </div>
        </div>
        <div className="py-2 mt-4">
            <h3 className="px-4 pt-4 pb-2 text-sm font-semibold text-gray-500 uppercase">More</h3>
            <div className="divide-y divide-gray-100">
                <SettingsItem label="Notifications" icon={UserCircleIcon} />
                <SettingsItem label="Help & Support" icon={UserCircleIcon} />
                <SettingsItem label="About" icon={UserCircleIcon} />
            </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsScreen;
