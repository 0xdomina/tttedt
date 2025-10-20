import React from 'react';
import { useUserStore } from '../store';
import { users } from '../data/mockData';
import { User } from '../types';

interface DevUserSwitcherProps {
  onUserSelected: () => void;
}

const personaUserIds = [1, 2, 3, 11, 12, 7];

const getRoleDescription = (user: User): string => {
    if (user.accountType === 'business') {
        return `Business - ${user.businessType?.charAt(0).toUpperCase()}${user.businessType?.slice(1)}`;
    }
    if (user.agentStatus === 'verified') {
        return 'Verified Agent & Renter';
    }
    if (user.listerStatus === 'verified') {
        return 'Verified Lister / Landlord';
    }
    return 'Standard Renter';
};

const UserSelectionCard: React.FC<{ user: User, onSelect: () => void }> = ({ user, onSelect }) => {
    return (
        <button
            onClick={onSelect}
            className="w-full text-left p-4 border border-gray-200 rounded-lg flex items-center gap-4 hover:bg-violet-50 hover:border-violet-300 transition-all duration-200"
        >
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full" />
            <div>
                <h3 className="font-bold text-lg text-gray-800">{user.name}</h3>
                <p className="text-gray-600">@{user.username}</p>
                <p className="text-sm font-semibold text-violet-700 mt-1">{getRoleDescription(user)}</p>
            </div>
        </button>
    );
};

const DevUserSwitcher: React.FC<DevUserSwitcherProps> = ({ onUserSelected }) => {
  const { setCurrentUserId } = useUserStore();

  const handleUserSelect = (userId: number) => {
    setCurrentUserId(userId);
    onUserSelected();
  };

  const personaUsers = personaUserIds.map(id => users.find(u => u.id === id)).filter((u): u is User => !!u);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Developer User Switcher</h1>
            <p className="text-gray-500 mt-2">Select a user persona to continue into the app.</p>
          </div>
          <div className="mt-8 space-y-4">
            {personaUsers.map(user => (
              <UserSelectionCard 
                key={user.id} 
                user={user} 
                onSelect={() => handleUserSelect(user.id)} 
              />
            ))}
          </div>
          <p className="text-xs text-center text-gray-400 mt-6">
            This screen is for development purposes and can be removed by editing `App.tsx`.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DevUserSwitcher;
