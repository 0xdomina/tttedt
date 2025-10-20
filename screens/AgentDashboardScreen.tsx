import React, { useState } from 'react';
import { ScheduledTour } from '../types';
import { ClipboardListIcon, CheckCircleIcon, CashIcon, GiftIcon, CalendarIcon } from '../components/Icons';
import { useUserStore, useAppDataStore, useUIStore } from '../store';
import { useGetUsers, useGetProperties, useGetTours } from '../hooks/useData';
import PropertyPostSkeleton from '../components/skeletons/PropertyPostSkeleton';

const StatCard: React.FC<{ value: number | string; label: string; icon: React.ReactNode }> = ({ value, label, icon }) => (
    <div className="bg-gray-100 p-4 rounded-lg flex items-center space-x-3">
        <div className="bg-white p-2 rounded-full">{icon}</div>
        <div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm font-medium text-gray-600">{label}</p>
        </div>
    </div>
);

const TourRequestCard: React.FC<{ tour: ScheduledTour; onConfirm: (time: string) => void; }> = ({ tour, onConfirm }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img src={tour.property.images[0]} alt={tour.property.location} className="w-full sm:w-24 h-24 object-cover rounded-md" loading="lazy" />
                <div className="flex-1">
                    <p className="font-bold text-gray-800">{tour.property.location}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <img src={tour.renter.avatar} alt={tour.renter.name} className="w-6 h-6 rounded-full" loading="lazy" />
                        <div>
                          <span className="text-sm text-gray-600">Renter: {tour.renter.name}</span>
                          <span className="text-xs text-gray-500 block">@{tour.renter.username}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700">Proposed Times:</h4>
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    {tour.proposedTimes.map((time, index) => (
                        <button key={index} onClick={() => onConfirm(time)} className="flex-1 text-center px-3 py-1.5 bg-violet-100 text-violet-700 text-xs font-semibold rounded-md hover:bg-violet-200">
                            {new Date(time).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};


const AgentDashboardScreen: React.FC = () => {
    const { currentUserId } = useUserStore();
    const { data: users, isLoading: isLoadingUsers } = useGetUsers();
    const { data: properties, isLoading: isLoadingProperties } = useGetProperties();
    const { data: toursData, isLoading: isLoadingTours } = useGetTours();
    const tours = toursData || [];

    const { confirmTour } = useAppDataStore();
    const { setActiveTab } = useUIStore();
    
    const currentUser = users?.find(u => u.id === currentUserId);

    const [copied, setCopied] = useState(false);

    if (isLoadingUsers || isLoadingProperties || isLoadingTours || !currentUser) {
        return <PropertyPostSkeleton />;
    }
    
    const agentTasks = properties?.filter(p => p.verifier?.id === currentUser.id) || [];
    const pendingTasks = agentTasks.filter(p => p.verificationStatus === 'pending');
    const completedTasks = agentTasks.filter(p => p.verificationStatus === 'verified');

    const pendingTours = tours.filter(t => t.agent.id === currentUser.id && t.status === 'pending');
    const confirmedTours = tours.filter(t => t.agent.id === currentUser.id && t.status === 'confirmed');

    const totalVerificationEarnings = completedTasks.reduce((sum, task) => sum + (task.verificationFee || 0), 0);
    
    const handleShareCode = () => { 
        if(currentUser.referralCode) { 
            navigator.clipboard.writeText(currentUser.referralCode); 
            setCopied(true); 
            setTimeout(() => setCopied(false), 2000); 
        } 
    };

    return (
        <div className="w-full h-full flex justify-center">
            <div className="w-full max-w-2xl bg-white">
                <main className="flex-grow overflow-y-auto no-scrollbar p-4 space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-gray-800">Performance Overview</h2>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <StatCard value={`₦${totalVerificationEarnings.toLocaleString()}`} label="Verification Earnings" icon={<CashIcon className="w-6 h-6 text-green-600" />} />
                            <StatCard value={pendingTours.length} label="Pending Tours" icon={<CalendarIcon className="w-6 h-6 text-blue-600" />} />
                            <StatCard value={pendingTasks.length} label="Pending Verifications" icon={<ClipboardListIcon className="w-6 h-6 text-violet-600" />} />
                            <StatCard value={confirmedTours.length} label="Confirmed Tours" icon={<CheckCircleIcon className="w-6 h-6 text-yellow-600" />} />
                        </div>
                    </section>

                    {currentUser.referralCode && (
                        <section>
                            <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2"><GiftIcon className="w-5 h-5 text-violet-600"/><h3 className="font-bold text-violet-800">Refer & Earn!</h3></div>
                                    <p className="text-sm text-violet-700 mt-1">Referral code: <span className="font-bold">{currentUser.referralCode}</span></p>
                                </div>
                                <button onClick={handleShareCode} className="px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700 min-w-[90px] self-start sm:self-center">{copied ? 'Copied!' : 'Share Code'}</button>
                            </div>
                        </section>
                    )}
                    
                    <section>
                        <h2 className="text-xl font-bold text-gray-800">Tour Requests</h2>
                        <div className="mt-4 space-y-3">
                           {pendingTours.length > 0 ? (
                                pendingTours.map(tour => (
                                    <TourRequestCard key={tour.id} tour={tour} onConfirm={(time) => confirmTour(tour.id, time)} />
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">No pending tour requests.</p>
                            )}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800">Pending Verifications</h2>
                        <p className="text-sm text-gray-500">These are verification bounties you have accepted.</p>
                         <div className="mt-4 space-y-3">
                           {pendingTasks.length > 0 ? (
                               pendingTasks.map(task => (
                                   <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                       <img src={task.images[0]} alt={task.location} className="w-full sm:w-24 h-24 object-cover rounded-md" loading="lazy" />
                                       <div className="flex-1">
                                           <p className="font-bold text-gray-800">{task.location}</p>
                                           <div className="flex items-center gap-2 mt-2">
                                               <img src={task.lister.avatar} alt={task.lister.name} className="w-6 h-6 rounded-full" loading="lazy" />
                                               <div>
                                                 <span className="text-sm text-gray-600">Lister: {task.lister.name}</span>
                                                 <span className="text-xs text-gray-500 block">@{task.lister.username}</span>
                                               </div>
                                           </div>
                                       </div>
                                       <button onClick={() => setActiveTab('messages')} className="w-full sm:w-auto mt-2 sm:mt-0 px-4 py-2 bg-green-600 text-white rounded-full font-semibold text-sm flex items-center justify-center gap-2 hover:bg-green-700">
                                           <CheckCircleIcon className="w-4 h-4" />
                                           Verify Now
                                       </button>
                                   </div>
                               ))
                           ) : (
                               <p className="text-gray-500 text-center py-4">No pending verification tasks. Great job!</p>
                           )}
                       </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default AgentDashboardScreen;
