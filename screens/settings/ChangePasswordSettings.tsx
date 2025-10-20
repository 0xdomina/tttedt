import React, { useState } from 'react';
import { ArrowLeftIcon } from '../../components/Icons';
import { useUIStore } from '../../store';

const ChangePasswordSettings: React.FC = () => {
  const { setSettingsView } = useUIStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isFormValid = currentPassword && newPassword.length >= 8 && newPassword === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
        alert('Password changed successfully!');
        setSettingsView('main');
    }
  };

  return (
    <div className="absolute inset-0 bg-white z-40 flex flex-col">
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-gray-200 p-4 flex items-center space-x-4">
        <button onClick={() => setSettingsView('main')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Change Password</h1>
      </header>
      
      <main className="flex-grow overflow-y-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                <input type="password" id="currentPassword" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500" />
            </div>
            <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                <input type="password" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500" />
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long.</p>
            </div>
            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500" />
            </div>
        </form>
      </main>
      <footer className="p-4 border-t border-gray-100">
        <button onClick={handleSubmit} disabled={!isFormValid} className="w-full py-2.5 bg-violet-600 text-white rounded-full font-semibold hover:bg-violet-700 disabled:bg-violet-300">
            Update Password
        </button>
      </footer>
    </div>
  );
};

export default ChangePasswordSettings;
