import React from 'react';
import { Property } from '../../types';
import { DirectionsIcon } from '../Icons';

interface PropertyCardProps {
    property: Property;
    showDirectionsButton?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, showDirectionsButton }) => {
    const handleGetDirections = () => {
        // In a real app, this would open a deep link to a map application.
        // e.g., `window.open(`https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`)`
        const message = `Simulating navigation to property at coordinates:\nLatitude: ${property.latitude}\nLongitude: ${property.longitude}`;
        console.log(message);
        alert(message);
    };

    return (
        <article className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <div className="flex">
                <img src={property.images[0]} alt={property.location} className="w-1/3 h-auto object-cover" loading="lazy" />
                <div className="p-3 flex flex-col justify-between flex-1">
                    <div>
                        <p className="text-sm font-semibold text-gray-800">{property.location}</p>
                        <p className="text-lg font-bold text-violet-700 mt-1">₦{property.price?.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 text-xs font-medium mt-2">
                        <span>{property.beds} {property.beds === 1 ? 'bed' : 'beds'}</span>
                        <span>•</span>
                        <span>{property.baths} {property.baths === 1 ? 'bath' : 'baths'}</span>
                    </div>
                </div>
            </div>
            {showDirectionsButton && (
                <div className="border-t border-gray-100 p-2">
                    <button 
                        onClick={handleGetDirections}
                        className="w-full flex items-center justify-center gap-2 py-1.5 text-sm font-semibold text-violet-600 bg-violet-50 rounded-md hover:bg-violet-100 transition-colors"
                    >
                        <DirectionsIcon className="w-4 h-4" />
                        Get Directions
                    </button>
                </div>
            )}
        </article>
    );
};

export default PropertyCard;