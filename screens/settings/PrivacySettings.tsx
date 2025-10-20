import React, { useState } from 'react';
import { ArrowLeftIcon } from '../../components/Icons';
import { useUserStore, useUIStore } from '../../store';
import { useGetUsers } from '../../hooks/useData';

interface PrivacyToggleProps {
    label: string;
    description: string;
    isEnabled: boolean;
    onToggle: (enabled: boolean) => void;
}

const PrivacyToggle: React.FC<PrivacyToggleProps> = ({ label, description, isEnabled, onToggle }) => (
    <div className="flex items-center justify-between py-4">
        <div>
            <p className="font-medium text-gray-800">{label}</p>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <button onClick={() => onToggle(!isEnabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isEnabled ? 'bg-violet-600' : 'bg-gray-200'}`}>
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);


const PrivacySettings: React.FC = () => {
    const { currentUserId } = useUserStore();
    const { data: users } = useGetUsers();
    const currentUser = users?.find(u => u.id === currentUserId);
    const { setSettingsView } = useUIStore();
    const [isPrivate, setIsPrivate] = useState(currentUser?.isPrivate || false);

    if (!currentUser) return null;

  return (
    <div className="absolute inset-0 bg-white z-40 flex flex-col">
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-gray-200 p-4 flex items-center space-x-4">
        <button onClick={() => setSettingsView('main')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Privacy and Security</h1>
      </header>
      
      <main className="flex-grow overflow-y-auto px-4">
        <div className="divide-y divide-gray-200">
            <PrivacyToggle 
                label="Private Account"
                description="When your account is private, only people you approve can see your posts and liked properties."
                isEnabled={isPrivate}
                onToggle={setIsPrivate}
            />
        </div>
      </main>
    </div>
  );
};

export default PrivacySettings;
