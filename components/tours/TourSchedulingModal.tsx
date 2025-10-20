import React, { useState } from 'react';
import { CloseIcon, CalendarIcon } from '../Icons';
import { useUIStore } from '../../store';

interface TourSchedulingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (propertyId: number, proposedTimes: string[]) => void;
}

const TourSchedulingModal: React.FC<TourSchedulingModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const { selectedProperty: property } = useUIStore();
    const [proposedTimes, setProposedTimes] = useState<string[]>(['', '', '']);
    const [proposedDates, setProposedDates] = useState<string[]>(['', '', '']);

    if (!isOpen || !property) return null;

    const handleDateChange = (index: number, value: string) => {
        const newDates = [...proposedDates];
        newDates[index] = value;
        setProposedDates(newDates);
    };

    const handleTimeChange = (index: number, value: string) => {
        const newTimes = [...proposedTimes];
        newTimes[index] = value;
        setProposedTimes(newTimes);
    };

    const handleSubmit = () => {
        const validProposedTimes = proposedDates
            .map((date, index) => {
                const time = proposedTimes[index];
                if (date && time) {
                    return new Date(`${date}T${time}`).toISOString();
                }
                return null;
            })
            .filter((dateTime): dateTime is string => dateTime !== null);

        if (validProposedTimes.length > 0) {
            onSubmit(property.id, validProposedTimes);
        } else {
            alert('Please select at least one date and time slot.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">Schedule a Tour</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </header>
                <main className="p-6">
                    <p className="text-gray-600">Propose up to 3 date and time slots to visit the property at <span className="font-semibold">{property.location}</span>.</p>
                    
                    <div className="space-y-4 mt-4">
                        {[0, 1, 2].map(index => (
                            <div key={index} className="flex items-center gap-2">
                                <span className="font-semibold text-gray-500">{index + 1}.</span>
                                <input 
                                    type="date"
                                    value={proposedDates[index]}
                                    onChange={(e) => handleDateChange(index, e.target.value)}
                                    className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-violet-500"
                                    min={new Date().toISOString().split("T")[0]}
                                />
                                <input 
                                    type="time"
                                    value={proposedTimes[index]}
                                    onChange={(e) => handleTimeChange(index, e.target.value)}
                                    className="p-2 border border-gray-300 rounded-md focus:ring-violet-500"
                                />
                            </div>
                        ))}
                    </div>
                </main>
                <footer className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
                    <button
                        onClick={handleSubmit}
                        className="w-full py-2.5 bg-violet-600 text-white rounded-full font-semibold hover:bg-violet-700 flex items-center justify-center gap-2"
                    >
                        <CalendarIcon className="w-5 h-5" />
                        Send Tour Request
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default TourSchedulingModal;