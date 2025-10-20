import React from 'react';
import { Property } from '../types';
import { CashIcon, ClipboardListIcon, EyeIcon } from '../components/Icons';
import { useUserStore } from '../store';
import { useGetUsers, useGetProperties } from '../hooks/useData';
import PropertyPostSkeleton from '../components/skeletons/PropertyPostSkeleton';

const StatCard: React.FC<{ value: string; label: string; icon: React.ReactNode }> = ({ value, label, icon }) => (
    <div className="bg-gray-100 p-4 rounded-lg flex items-center space-x-3">
        <div className="bg-white p-2 rounded-full">{icon}</div>
        <div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm font-medium text-gray-600">{label}</p>
        </div>
    </div>
);

const PropertyManagementRow: React.FC<{ property: Property; onToggle: () => void }> = ({ property, onToggle }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <img src={property.images[0]} alt={property.location} className="w-full sm:w-24 h-24 object-cover rounded-md" loading="lazy" />
        <div className="flex-1">
            <p className="font-bold text-gray-800">{property.location}</p>
            <p className="text-sm text-gray-500">{property.beds} Bed, {property.baths} Bath</p>
            <p className="text-sm font-semibold text-violet-700 mt-1">₦{property.price?.toLocaleString()} / {property.priceInterval}</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
            <span className={`text-xs font-semibold ${property.isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
                {property.isAvailable ? 'Available' : 'Unavailable'}
            </span>
            <button onClick={onToggle} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${property.isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}>
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${property.isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
    </div>
);


const BusinessDashboardScreen: React.FC = () => {
    const { currentUserId } = useUserStore();
    const { data: users, isLoading: isLoadingUsers } = useGetUsers();
    const { data: properties, isLoading: isLoadingProperties } = useGetProperties();
    // In a real app, this would be a mutation. For now, it's a mock client-side action.
    const togglePropertyAvailability = (id: number) => console.log(`Toggling availability for ${id}`);
    
    const currentUser = users?.find(u => u.id === currentUserId);
    
    if (isLoadingUsers || isLoadingProperties || !currentUser) {
        return <PropertyPostSkeleton />;
    }

    const businessProperties = properties?.filter(p => p.lister.id === currentUser.id) || [];
    const totalViews = businessProperties.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalLikes = businessProperties.reduce((sum, p) => sum + (p.likes || 0), 0);
    
    return (
        <div className="w-full h-full flex justify-center">
            <div className="w-full max-w-2xl bg-white">
                <main className="flex-grow overflow-y-auto no-scrollbar p-4 space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-gray-800">Performance Overview</h2>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <StatCard value={businessProperties.length.toString()} label="Active Listings" icon={<ClipboardListIcon className="w-6 h-6 text-violet-600" />} />
                            <StatCard value={totalLikes.toLocaleString()} label="Total Likes" icon={<EyeIcon className="w-6 h-6 text-blue-600" />} />
                            <StatCard value={totalViews.toLocaleString()} label="Total Views" icon={<EyeIcon className="w-6 h-6 text-yellow-600" />} />
                            <StatCard value={`₦${(currentUser.referralStats?.earnings || 0).toLocaleString()}`} label="Referral Earnings" icon={<CashIcon className="w-6 h-6 text-green-600" />} />
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800">Property Management</h2>
                        <p className="text-sm text-gray-500">Toggle availability for your short-term rental listings.</p>
                         <div className="mt-4 space-y-3">
                           {businessProperties.length > 0 ? (
                               businessProperties
                                .filter(p => p.businessType === 'hotel' || p.businessType === 'shortlet')
                                .map(prop => (
                                   <PropertyManagementRow key={prop.id} property={prop} onToggle={() => togglePropertyAvailability(prop.id)} />
                               ))
                           ) : (
                               <p className="text-gray-500 text-center py-4">You have no properties listed yet.</p>
                           )}
                       </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default BusinessDashboardScreen;
