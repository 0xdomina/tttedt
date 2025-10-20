import React from 'react';
import { ServiceProvider } from '../../types';
import { StarIcon, MessageCircleIcon } from '../Icons';

interface ServiceProviderCardProps {
    provider: ServiceProvider;
}

const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({ provider }) => {
    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center space-x-4">
            <img src={provider.avatar} alt={provider.name} className="w-16 h-16 rounded-full object-cover" loading="lazy" />
            <div className="flex-1">
                <h3 className="font-bold text-gray-800">{provider.name}</h3>
                <p className="text-sm text-violet-700 font-semibold">{provider.service}</p>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <div className="flex items-center gap-0.5">
                        <StarIcon className="w-4 h-4 text-yellow-400" filled />
                        <span className="font-bold text-gray-700">{provider.rating}</span>
                    </div>
                    <span>({provider.reviewsCount} reviews)</span>
                </div>
            </div>
            <button className="px-4 py-2 bg-violet-600 text-white rounded-full font-semibold text-sm flex items-center justify-center gap-2 hover:bg-violet-700">
                <MessageCircleIcon className="w-4 h-4" />
                Contact
            </button>
        </div>
    );
};

export default ServiceProviderCard;