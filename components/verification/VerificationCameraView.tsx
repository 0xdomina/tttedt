import React, { useState } from 'react';
import { CameraIcon, CheckCircleIcon, SpinnerIcon } from '../Icons';
import { useUIStore } from '../../store';

interface VerificationCameraViewProps {
    onClose: () => void;
    onSubmit: () => void;
}

// Helper function for distance calculation (Haversine formula)
const getDistanceInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};
const KM_IN_MILE = 1.60934;
const PROXIMITY_THRESHOLD_MILES = 0.25;
const PROXIMITY_THRESHOLD_KM = PROXIMITY_THRESHOLD_MILES * KM_IN_MILE; // ~0.4 km


const VerificationCameraView: React.FC<VerificationCameraViewProps> = ({ onClose, onSubmit }) => {
    const { selectedProperty: property } = useUIStore();
    const [photoTaken, setPhotoTaken] = useState(false);
    const [checklist, setChecklist] = useState({ detailsMatch: false, photosAccurate: false });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState('Submit Verification Report');

    const handleChecklistChange = (key: keyof typeof checklist) => {
        setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
    };
    
    const isSubmittable = photoTaken && checklist.detailsMatch && checklist.photosAccurate;
    
    const handleSubmit = async () => {
        if (!isSubmittable || isSubmitting) return;

        setIsSubmitting(true);
        setStatusMessage('Checking location...');

        if (!property?.latitude || !property?.longitude) {
            alert("Error: Property location is missing. Cannot verify proximity.");
            setIsSubmitting(false);
            setStatusMessage('Submit Verification Report');
            return;
        }

        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                });
            });
            
            const agentLat = position.coords.latitude;
            const agentLon = position.coords.longitude;
            
            const distance = getDistanceInKm(agentLat, agentLon, property.latitude, property.longitude);
            
            if (distance > PROXIMITY_THRESHOLD_KM) {
                alert(`You are too far from the property to submit a verification.\n\nRequired distance: < ${PROXIMITY_THRESHOLD_MILES} miles.\nYour distance: ~${(distance / KM_IN_MILE).toFixed(2)} miles.`);
                setIsSubmitting(false);
                setStatusMessage('Submit Verification Report');
                return;
            }

            // Proximity check passed, now submit the report
            setStatusMessage('Submitting...');
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network request
            onSubmit();

        } catch (error) {
            console.error("Geolocation error:", error);
            let errorMessage = "Could not get your location. Please enable location services and try again.";
            if (error instanceof GeolocationPositionError) {
                if (error.code === error.PERMISSION_DENIED) {
                    errorMessage = "Location permission denied. Please enable it in your browser settings.";
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    errorMessage = "Location information is unavailable.";
                } else if (error.code === error.TIMEOUT) {
                    errorMessage = "The request to get user location timed out.";
                }
            }
            alert(errorMessage);
            setIsSubmitting(false);
            setStatusMessage('Submit Verification Report');
        }
    };

    if (!property) {
        return (
            <div className="absolute inset-0 bg-white z-40 flex flex-col items-center justify-center">
                <p>Error: Property not found.</p>
                <button onClick={onClose} className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg">Close</button>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 bg-white z-40 flex flex-col">
            <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200">
                <h1 className="text-lg font-bold text-gray-800">Verify Property</h1>
                <button onClick={onClose} className="text-2xl font-light">&times;</button>
            </header>

            <main className="flex-grow overflow-y-auto p-4 space-y-6">
                <div>
                    <h2 className="font-semibold text-gray-700">Step 1: Geo-tagged Photo</h2>
                    <p className="text-sm text-gray-500">Use the in-app camera to take a time-stamped photo of the property's exterior.</p>
                    <div className="mt-3 aspect-video w-full bg-gray-900 rounded-lg flex flex-col items-center justify-center text-white">
                        {photoTaken ? (
                            <div className="text-center p-4">
                               <img src={property.images[0] || 'https://placehold.co/600x400/27272a/e5e5e5?text=Property+Exterior'} alt="property" className="w-full h-32 object-cover rounded-md opacity-80" />
                                <p className="text-xs mt-2 bg-black/50 px-2 py-1 rounded">
                                   Timestamp: {new Date().toLocaleString()} <br/>
                                   Geo: 6.4475, 3.4735
                                </p>
                            </div>
                        ) : (
                             <CameraIcon className="w-16 h-16 text-gray-500" />
                        )}
                    </div>
                    <button 
                        onClick={() => setPhotoTaken(true)} 
                        disabled={photoTaken}
                        className="w-full mt-3 py-2.5 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 disabled:bg-gray-400"
                    >
                        {photoTaken ? 'Photo Captured' : 'Take Geo-tagged Photo'}
                    </button>
                </div>
                 <div>
                    <h2 className="font-semibold text-gray-700">Step 2: Verification Checklist</h2>
                     <div className="mt-3 space-y-3">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" checked={checklist.detailsMatch} onChange={() => handleChecklistChange('detailsMatch')} className="h-5 w-5 rounded text-violet-600 focus:ring-violet-500" />
                            <span className="text-gray-700">Property details (beds, baths, location) match the listing.</span>
                        </label>
                         <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" checked={checklist.photosAccurate} onChange={() => handleChecklistChange('photosAccurate')} className="h-5 w-5 rounded text-violet-600 focus:ring-violet-500" />
                            <span className="text-gray-700">Lister's photos are an accurate representation of the property.</span>
                        </label>
                    </div>
                </div>
            </main>
            
            <footer className="p-4 border-t border-gray-200">
                <button
                    onClick={handleSubmit}
                    disabled={!isSubmittable || isSubmitting}
                    className="w-full py-3 bg-green-600 text-white rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-green-700 disabled:bg-gray-400"
                >
                    {isSubmitting ? <SpinnerIcon className="w-5 h-5" /> : <CheckCircleIcon className="w-5 h-5"/>}
                    {statusMessage}
                </button>
            </footer>

        </div>
    );
};

export default VerificationCameraView;