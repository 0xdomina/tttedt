"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Property, Neighborhood } from '../../types';
import PropertyCard from '../property/PropertyCard';

interface MapViewProps {
    properties: Property[];
    neighborhoods: Neighborhood[];
    centerCoordinates: { lat: number; lng: number } | null;
    onSelectNeighborhood: (id: number) => void;
}

const DEFAULT_CENTER: [number, number] = [6.5244, 3.3792]; // Lagos approx
const DEFAULT_ZOOM = 12;

function FlyToWhenReady({ center }: { center: { lat: number; lng: number } | null }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView([center.lat, center.lng], Math.max(map.getZoom(), 13), { animate: true });
        }
    }, [center, map]);
    return null;
}

const MapView: React.FC<MapViewProps> = ({ properties, neighborhoods, centerCoordinates, onSelectNeighborhood }) => {
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

    // Ensure Leaflet's default icon URLs are set (avoids broken marker icons when bundlers move assets)
    useEffect(() => {
        delete (L.Icon.Default as any).prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: '/images/marker-icon-2x.png',
            iconUrl: '/images/marker-icon.png',
            shadowUrl: '/images/marker-shadow.png',
        } as any);
    }, []);

    return (
        <div className="w-full h-full relative">
            <MapContainer center={centerCoordinates ? [centerCoordinates.lat, centerCoordinates.lng] : DEFAULT_CENTER} zoom={DEFAULT_ZOOM} className="w-full h-full rounded-xl">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <FlyToWhenReady center={centerCoordinates} />

                {properties.map((property) => {
                    if (!property.latitude || !property.longitude) return null;
                    return (
                        <CircleMarker
                            key={property.id}
                            center={[property.latitude, property.longitude]}
                            radius={8}
                            pathOptions={{ color: selectedProperty?.id === property.id ? '#7c3aed' : '#ef4444' }}
                            eventHandlers={{
                                click: () => setSelectedProperty(property),
                            }}
                        >
                            <Popup>
                                <div className="w-64">
                                    <PropertyCard property={property} showDirectionsButton={true} />
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}

                {neighborhoods.map((hub) => {
                    if (!hub.latitude || !hub.longitude) return null;
                    // Use a simple Marker for neighborhoods
                    const icon = L.divIcon({
                        className: 'bg-transparent',
                        html: `<div class="flex items-center justify-center rounded-full bg-white p-1 shadow-md"><svg xmlns=\"http://www.w3.org/2000/svg\" class=\"w-6 h-6 text-blue-600\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M8 10h.01M12 10h.01M16 10h.01M9 16h6\"/></svg></div>`,
                    });

                    return (
                        <Marker
                            key={`hub-${hub.id}`}
                            position={[hub.latitude, hub.longitude]}
                            icon={icon}
                            eventHandlers={{ click: () => onSelectNeighborhood(hub.id) }}
                        />
                    );
                })}
            </MapContainer>

            {selectedProperty && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-[90%] sm:w-96">
                    <PropertyCard property={selectedProperty} showDirectionsButton={true} />
                </div>
            )}
        </div>
    );
};

export default MapView;