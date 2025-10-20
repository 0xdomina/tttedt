
import React from 'react';
// FIX: Imported UserSummary type to allow the component to accept partial user objects.
import { User, UserSummary } from '../../types';
import { CheckmarkBadgeIcon } from '../Icons';

interface UserVerifiedBadgeProps {
    // FIX: Changed prop to a union type to accept both full and summary user objects.
    user: User | UserSummary;
}

const UserVerifiedBadge: React.FC<UserVerifiedBadgeProps> = ({ user }) => {
    // FIX: Used a type guard to safely access properties that only exist on the User type.
    if ('businessStatus' in user && user.businessStatus === 'verified') {
        return <CheckmarkBadgeIcon className="w-5 h-5 text-green-500" />;
    }
    if (user.agentStatus === 'verified') {
        return <CheckmarkBadgeIcon className="w-5 h-5 text-blue-500" />;
    }
    if (user.listerStatus === 'verified') {
        return <CheckmarkBadgeIcon className="w-5 h-5 text-yellow-500" />;
    }
    return null;
};

export default UserVerifiedBadge;
