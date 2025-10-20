import React from 'react';
import { Review, User, UserSummary } from '../../types';
import { StarIcon } from '../Icons';
import UserVerifiedBadge from '../common/UserVerifiedBadge';
import { useUIStore } from '../../store';

interface ReviewItemProps {
    review: Review;
    reviewedUser?: User;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center" role="img" aria-label={`${rating} out of 5 stars`}>
        {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} filled={i < rating} />
        ))}
    </div>
);


const ReviewItem: React.FC<ReviewItemProps> = ({ review, reviewedUser }) => {
    const { viewProfile } = useUIStore();
    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return Math.floor(seconds) + "s ago";
    }

    const displayUser = reviewedUser || review.reviewer;

    return (
        <div className="flex items-start space-x-3 p-4">
            <button onClick={() => viewProfile(displayUser.id)}>
                <img src={displayUser.avatar} alt={displayUser.name} className="w-10 h-10 rounded-full hover:opacity-80 transition-opacity" loading="lazy" />
            </button>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div>
                         <button onClick={() => viewProfile(displayUser.id)} className="text-left group">
                            <div className="flex items-center gap-1.5">
                                <p className="font-bold text-sm text-gray-800 group-hover:underline">{displayUser.name}</p>
                                {/* This component now accepts User or UserSummary, fixing the type error. */}
                                <UserVerifiedBadge user={displayUser as User | UserSummary} />
                            </div>
                            <p className="text-xs text-gray-500">@{displayUser.username}</p>
                        </button>
                        <p className="text-xs text-gray-500">{timeAgo(review.timestamp)}</p>
                    </div>
                    <StarRating rating={review.rating} />
                </div>
                 {reviewedUser && (
                    <p className="text-xs text-gray-500 mt-1 italic">Your review for {reviewedUser.name}</p>
                )}
                <p className="text-sm text-gray-700 mt-2">{review.text}</p>
            </div>
        </div>
    );
};

export default ReviewItem;
