import React from 'react';
import { useUIStore } from '../../store';

interface VerificationTaskModalProps {
    onAccept: () => void;
    onDecline: () => void;
}

const VerificationTaskModal: React.FC<VerificationTaskModalProps> = ({ onAccept, onDecline }) => {
    const { selectedProperty } = useUIStore();

    if (!selectedProperty) return null;

    return (
        <div className="absolute inset-0 bg-black/50 z-30 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
                <h2 className="text-xl font-bold text-gray-800">Accept Verification Task?</h2>
                <p className="mt-2 text-gray-600">
                    You are about to accept the 'Agent Bounty' for the property at <span className="font-semibold">{selectedProperty.location}</span>.
                </p>
                <p className="mt-4 text-sm text-gray-500">
                    You will be connected with the lister, <span className="font-semibold">{selectedProperty.lister.name}</span>, to arrange the verification.
                </p>
                <div className="mt-6 flex justify-center space-x-4">
                    <button 
                        onClick={onDecline} 
                        className="px-6 py-2.5 text-sm font-semibold bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300"
                    >
                        Decline
                    </button>
                    <button 
                        onClick={onAccept} 
                        className="px-6 py-2.5 text-sm font-semibold bg-violet-600 text-white rounded-full hover:bg-violet-700"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerificationTaskModal;