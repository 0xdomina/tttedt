import React, { useMemo } from 'react';
import { NeighborhoodReview } from '../../types';
import { StarIcon } from '../Icons';

interface NeighborhoodRatingSummaryProps {
    reviews: NeighborhoodReview[];
}

const RatingBar: React.FC<{ label: string; rating: number }> = ({ label, rating }) => (
    <div className="flex items-center gap-4">
        <span className="w-20 text-sm font-medium text-gray-600">{label}</span>
        <div className="flex-1 bg-gray-200 rounded-full h-2.5">
            <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${(rating / 5) * 100}%` }}></div>
        </div>
        <span className="w-8 text-right font-bold text-gray-800">{rating.toFixed(1)}</span>
    </div>
);


const NeighborhoodRatingSummary: React.FC<NeighborhoodRatingSummaryProps> = ({ reviews }) => {
    const averageRatings = useMemo(() => {
        if (reviews.length === 0) {
            return { security: 0, power: 0, internet: 0, overall: 0 };
        }
        const totals = reviews.reduce((acc, review) => {
            acc.security += review.ratings.security;
            acc.power += review.ratings.power;
            acc.internet += review.ratings.internet;
            return acc;
        }, { security: 0, power: 0, internet: 0 });
        
        const avgSecurity = totals.security / reviews.length;
        const avgPower = totals.power / reviews.length;
        const avgInternet = totals.internet / reviews.length;
        const overall = (avgSecurity + avgPower + avgInternet) / 3;

        return { security: avgSecurity, power: avgPower, internet: avgInternet, overall };
    }, [reviews]);
    
    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">Community Ratings</h3>
            <div className="flex items-center gap-2 mt-2">
                <StarIcon className="w-6 h-6 text-yellow-400" filled />
                <span className="text-2xl font-bold text-gray-800">{averageRatings.overall.toFixed(1)}</span>
                <span className="text-sm text-gray-500">based on {reviews.length} reviews</span>
            </div>
            <div className="mt-4 space-y-3">
                <RatingBar label="Security" rating={averageRatings.security} />
                <RatingBar label="Power" rating={averageRatings.power} />
                <RatingBar label="Internet" rating={averageRatings.internet} />
            </div>
        </div>
    );
};

export default NeighborhoodRatingSummary;
