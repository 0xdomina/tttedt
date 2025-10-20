import React from 'react';
import { useUIStore } from '../../store';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const { selectedProperty: property } = useUIStore();

    if (!isOpen || !property) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-gray-800">Confirm Payment</h2>
                <p className="mt-2 text-gray-600">
                    You are about to pay <strong>₦{property.price?.toLocaleString()}</strong> to secure the property at <span className="font-medium">{property.location}</span>.
                </p>
                <p className="mt-4 text-xs text-gray-500">This action cannot be undone. Funds will be held securely by edQorta and released to the lister upon successful deal completion.</p>
                <div className="mt-6 flex justify-center space-x-4">
                    <button 
                        onClick={onClose} 
                        className="px-6 py-2.5 text-sm font-semibold bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="px-6 py-2.5 text-sm font-semibold bg-green-600 text-white rounded-full hover:bg-green-700"
                    >
                        Confirm & Pay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;