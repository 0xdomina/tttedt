import React from 'react';
import { NeighborhoodReview } from '../../types';
import { StarIcon } from '../Icons';

interface NeighborhoodReviewCardProps {
    review: NeighborhoodReview;
    onViewProfile: (userId: number) => void;
}

const RatingPill: React.FC<{ label: string; rating: number }> = ({ label, rating }) => (
    <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs">
        <span className="font-semibold text-gray-700">{label}</span>
        <div className="flex items-center">
            <StarIcon className="w-3 h-3 text-yellow-400" filled />
            <span className="font-bold text-gray-800 ml-0.5">{rating}</span>
        </div>
    </div>
);

const NeighborhoodReviewCard: React.FC<NeighborhoodReviewCardProps> = ({ review, onViewProfile }) => {
    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-start gap-3">
                <button 
                    onClick={() => onViewProfile(review.author.id)}
                    className="flex-shrink-0"
                >
                    <img src={review.author.avatar} alt={review.author.name} className="w-10 h-10 rounded-full" />
                </button>
                <div className="flex-1">
                    <button 
                        onClick={() => onViewProfile(review.author.id)}
                        className="text-left group"
                    >
                        <p className="font-bold text-sm text-gray-800 group-hover:underline">{review.author.name}</p>
                        <p className="text-xs text-gray-500">@{review.author.username}</p>
                    </button>
                    <p className="mt-2 text-gray-700 text-sm">{review.text}</p>
                </div>
            </div>
             <div className="flex items-center flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                <RatingPill label="Security" rating={review.ratings.security} />
                <RatingPill label="Power" rating={review.ratings.power} />
                <RatingPill label="Internet" rating={review.ratings.internet} />
            </div>
        </div>
    );
};

export default NeighborhoodReviewCard;
