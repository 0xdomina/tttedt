import React from 'react';
import { Neighborhood } from '../../types';
import { ArrowRightIcon } from '../Icons';

interface NeighborhoodHubCardProps {
    neighborhood: Neighborhood;
    onClick: () => void;
}

const NeighborhoodHubCard: React.FC<NeighborhoodHubCardProps> = ({ neighborhood, onClick }) => {
    return (
        <article
            onClick={onClick}
            className="relative rounded-xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
            <img src={neighborhood.image} alt={neighborhood.name} className="w-full h-32 object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
            <div className="absolute bottom-0 left-0 p-4 text-white w-full">
                <p className="text-sm font-semibold">Community Hub</p>
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">{neighborhood.name}</h3>
                    <div className="bg-white/20 p-1.5 rounded-full group-hover:bg-white/30 transition-colors">
                        <ArrowRightIcon className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </article>
    );
};

export default NeighborhoodHubCard;