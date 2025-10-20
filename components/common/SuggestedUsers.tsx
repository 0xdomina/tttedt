import React from 'react';
import { User } from '../../types';
import { useUserStore } from '../../store';
import { useGetUsers, useToggleFollow } from '../../hooks/useData';
import UserVerifiedBadge from './UserVerifiedBadge';
import { useUIStore } from '../../store';

const SuggestedUsers: React.FC = () => {
    const { currentUserId } = useUserStore();
    const { data: users, isLoading } = useGetUsers();
    const { viewProfile } = useUIStore();
    const toggleFollowMutation = useToggleFollow();

    const currentUser = users?.find(u => u.id === currentUserId);
    
    const suggestedUsers = users?.filter(u => 
        u.id !== currentUserId && 
        !currentUser?.followingIds.includes(u.id)
    ).slice(0, 5);

    if (isLoading || !suggestedUsers || suggestedUsers.length === 0) {
        return (
            <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 animate-pulse">
                            <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="h-8 bg-gray-200 rounded-full w-20"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    return (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3">Suggested For You</h3>
            <div className="space-y-3">
                {suggestedUsers.map(user => (
                    <div key={user.id} className="flex items-center gap-3">
                        <button onClick={() => viewProfile(user.id)} className="flex items-center gap-3 flex-1 min-w-0 group">
                            <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
                            <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <p className="font-bold text-gray-800 truncate group-hover:underline">{user.name}</p>
                                    <UserVerifiedBadge user={user} />
                                </div>
                                <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                            </div>
                        </button>
                        <button 
                            onClick={() => toggleFollowMutation.mutate(user.id)} 
                            className="px-4 py-1.5 text-sm font-semibold bg-violet-600 text-white rounded-full hover:bg-violet-700"
                        >
                            Follow
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuggestedUsers;
