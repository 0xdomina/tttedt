import React, { useState, useEffect } from 'react';
import { Property, Neighborhood } from '../../types';
import { MapPinIcon, ChatAltIcon } from '../Icons';
import PropertyCard from '../property/PropertyCard';

interface MapViewProps {
    properties: Property[];
    neighborhoods: Neighborhood[];
    centerCoordinates: { lat: number; lng: number } | null;
    onSelectNeighborhood: (id: number) => void;
}

const MAP_WIDTH = 1200;
const MAP_HEIGHT = 800;
const LAGOS_BOUNDS = {
    minLat: 6.38,
    maxLat: 6.70,
    minLng: 3.00,
    maxLng: 3.75,
};

const convertCoordsToPixels = (lat: number, lng: number) => {
    const latRad = (lat - LAGOS_BOUNDS.minLat) / (LAGOS_BOUNDS.maxLat - LAGOS_BOUNDS.minLat);
    const lngRad = (lng - LAGOS_BOUNDS.minLng) / (LAGOS_BOUNDS.maxLng - LAGOS_BOUNDS.minLng);
    const x = lngRad * MAP_WIDTH;
    const y = (1 - latRad) * MAP_HEIGHT;
    return { x, y };
};

const MapView: React.FC<MapViewProps> = ({ properties, neighborhoods, centerCoordinates, onSelectNeighborhood }) => {
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (centerCoordinates) {
            const propertyToSelect = properties.find(p => p.latitude === centerCoordinates.lat && p.longitude === centerCoordinates.lng);
            if (propertyToSelect) {
                setSelectedProperty(propertyToSelect);
            }
            const { x, y } = convertCoordsToPixels(centerCoordinates.lat, centerCoordinates.lng);
            // This is a simplified centering logic. A real map would have complex viewport calculations.
            setMapOffset({ x: -x + window.innerWidth / 2, y: -y + window.innerHeight / 2 });
        }
    }, [centerCoordinates, properties]);

    return (
        <div className="relative w-full h-full overflow-hidden bg-gray-200">
            <div
                className="absolute transition-transform duration-500 ease-in-out"
                style={{
                    width: `${MAP_WIDTH}px`,
                    height: `${MAP_HEIGHT}px`,
                    transform: `translate(${mapOffset.x}px, ${mapOffset.y}px)`
                }}
            >
                <img 
                    src="https://i.imgur.com/8O12A3G.png" 
                    alt="Map of Lagos" 
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />
                {properties.map(property => {
                    if (!property.latitude || !property.longitude) return null;
                    const { x, y } = convertCoordsToPixels(property.latitude, property.longitude);
                    const isSelected = selectedProperty?.id === property.id;
                    
                    return (
                        <button
                            key={property.id}
                            onClick={() => setSelectedProperty(property)}
                            style={{ left: `${x}px`, top: `${y}px`, transform: 'translate(-50%, -100%)' }}
                            className="absolute z-10 transition-transform"
                        >
                            <MapPinIcon className={`w-8 h-8 drop-shadow-lg transition-all duration-200 ${isSelected ? 'text-violet-600 scale-125' : 'text-red-500'}`} />
                        </button>
                    )
                })}
                {neighborhoods.map(hub => {
                    if (!hub.latitude || !hub.longitude) return null;
                    const { x, y } = convertCoordsToPixels(hub.latitude, hub.longitude);
                    return (
                        <button
                            key={`hub-${hub.id}`}
                            onClick={() => onSelectNeighborhood(hub.id)}
                            style={{ left: `${x}px`, top: `${y}px`, transform: 'translate(-50%, -50%)' }}
                            className="absolute z-10 transition-transform group"
                            aria-label={`Open ${hub.name} Hub`}
                        >
                            <div className="relative">
                                <ChatAltIcon className="w-9 h-9 text-blue-600 drop-shadow-lg transition-transform group-hover:scale-110" />
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                    {hub.questions.length}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
            
            {selectedProperty && (
                 <div className="absolute bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 z-20 w-[90%] sm:w-80">
                    <PropertyCard property={selectedProperty} showDirectionsButton={true} />
                 </div>
            )}
        </div>
    );
};

export default MapView;