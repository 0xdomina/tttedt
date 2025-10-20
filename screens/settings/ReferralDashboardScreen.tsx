import React, { useState } from 'react';
import { ArrowLeftIcon, GiftIcon, MousePointerClickIcon, UserPlusIcon, DollarSignIcon } from '../../components/Icons';
import { useUserStore, useUIStore } from '../../store';
import { useGetUsers } from '../../hooks/useData';

const StatCard: React.FC<{ value: string | number; label: string; icon: React.ElementType }> = ({ value, label, icon: Icon }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center space-x-4">
    <div className="p-3 bg-gray-100 rounded-full">
      <Icon className="w-6 h-6 text-gray-600" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm font-medium text-gray-500">{label}</p>
    </div>
  </div>
);


const ReferralDashboardScreen: React.FC = () => {
  const { currentUserId } = useUserStore();
  const { data: users } = useGetUsers();
  const currentUser = users?.find(u => u.id === currentUserId);
  const { setSettingsView } = useUIStore();
  const [copied, setCopied] = useState(false);
  
  if (!currentUser) {
      return null; // Or a loading indicator
  }
  
  const referralLink = `https://edqorta.app/signup?ref=${currentUser.referralCode}`;

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="absolute inset-0 bg-gray-50 z-40 flex flex-col">
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-gray-200 p-4 flex items-center space-x-4">
        <button onClick={() => setSettingsView('main')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Refer & Earn</h1>
      </header>
      
      <main className="flex-grow overflow-y-auto p-4 space-y-6">
        <div className="text-center p-6 bg-violet-600 text-white rounded-2xl shadow-lg shadow-violet-500/20">
            <GiftIcon className="w-12 h-12 mx-auto" />
            <h2 className="mt-4 text-2xl font-bold">Invite Friends, Earn Cash</h2>
            <p className="mt-2 opacity-90 max-w-sm mx-auto">Share your code with friends. When they sign up and complete their first transaction, you both get rewarded!</p>
        </div>

        <div>
            <label className="text-sm font-semibold text-gray-600">Your Referral Code</label>
            <div className="mt-1 flex items-center gap-2">
                <p className="flex-grow p-3 bg-white border border-dashed border-gray-300 rounded-lg font-mono text-lg text-gray-800">{currentUser.referralCode}</p>
                <button onClick={() => handleCopy(currentUser.referralCode || '')} className="px-4 py-3 bg-violet-100 text-violet-700 font-semibold rounded-lg hover:bg-violet-200 transition-colors">
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
        </div>

        <div>
            <h3 className="text-lg font-bold text-gray-800">Your Stats</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <StatCard value={currentUser.referralStats?.clicks || 0} label="Link Clicks" icon={MousePointerClickIcon} />
                <StatCard value={currentUser.referralStats?.signups || 0} label="Successful Sign-ups" icon={UserPlusIcon} />
                <StatCard value={`₦${(currentUser.referralStats?.earnings || 0).toLocaleString()}`} label="Total Earnings" icon={DollarSignIcon} />
            </div>
        </div>
      </main>
    </div>
  );
};

export default ReferralDashboardScreen;
