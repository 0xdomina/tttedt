import React, { useState } from 'react';
import { ArrowLeftIcon, IdCardIcon } from '../Icons';

interface AgentApplicationFormProps {
    onClose: () => void;
    onSubmit: () => void;
}

const AgentApplicationForm: React.FC<AgentApplicationFormProps> = ({ onClose, onSubmit }) => {
    const [step, setStep] = useState(1);
    const [nin, setNin] = useState('');
    const [idType, setIdType] = useState('National ID Card (NIN Slip)');
    
    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would collect all form data and submit.
        // For this mock, we just move to the success step.
        nextStep();
        setTimeout(() => {
            onSubmit();
        }, 2000); // Wait 2 seconds on success screen before closing
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Become an edQorta Agent</h2>
                        <p className="mt-4 text-gray-600">
                            Join our network of trusted Community Agents to earn commissions by verifying properties and helping people find their next home.
                        </p>
                        <p className="mt-2 text-gray-600">
                           You'll need your NIN and a valid Government ID to get started.
                        </p>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Step 1: Verify your NIN</h2>
                        <label htmlFor="nin" className="block text-sm font-medium text-gray-700 mt-6">National Identification Number (NIN)</label>
                        <input
                            type="tel"
                            id="nin"
                            value={nin}
                            onChange={e => setNin(e.target.value.replace(/\D/g, ''))}
                            maxLength={11}
                            placeholder="Enter your 11-digit NIN"
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
                            autoFocus
                        />
                    </div>
                );
            case 3:
                 return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Step 2: Add Government ID</h2>
                         <p className="mt-2 text-gray-600">
                           This helps us confirm you are who you say you are.
                        </p>

                        <div className="mt-6">
                            <label htmlFor="idType" className="block text-sm font-medium text-gray-700">ID Type</label>
                            <select 
                                id="idType"
                                value={idType}
                                onChange={(e) => setIdType(e.target.value)}
                                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition bg-white"
                            >
                                <option>National ID Card (NIN Slip)</option>
                                <option>Driver's License</option>
                                <option>International Passport</option>
                                <option>Voter's Card</option>
                            </select>
                        </div>
                        
                         <div className="mt-6 text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                            <IdCardIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">Upload a clear photo of your ID</p>
                             <button type="button" className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700">
                                Choose File
                            </button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800">Application Submitted!</h2>
                        <p className="mt-4 text-gray-600">
                            We've received your application. We will review it within 2-3 business days and notify you of the outcome.
                        </p>
                    </div>
                );
            default:
                return null;
        }
    }
    
    return (
        <div className="absolute inset-0 bg-black/40 z-50 flex justify-center items-end" onClick={onClose}>
            <div className="w-full max-w-sm bg-white rounded-t-3xl shadow-2xl p-6 flex flex-col h-[70%]" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between mb-6">
                    {step > 1 && step < 4 ? (
                         <button onClick={prevStep} className="p-2 rounded-full hover:bg-gray-100">
                            <ArrowLeftIcon />
                        </button>
                    ) : <div className="w-10"></div>}
                   <h2 className="font-bold text-lg text-gray-800">Agent Application</h2>
                    <button onClick={onClose} className="text-2xl font-light">&times;</button>
                </header>

                <main className="flex-grow">
                    {renderStep()}
                </main>

                <footer className="mt-auto">
                    {step < 3 && (
                        <button onClick={nextStep} disabled={step === 2 && nin.length !== 11} className="w-full py-3 px-6 bg-violet-600 text-white rounded-full font-semibold transition-colors disabled:bg-violet-300 disabled:cursor-not-allowed hover:bg-violet-700">
                            Continue
                        </button>
                    )}
                    {step === 3 && (
                         <button onClick={handleSubmit} className="w-full py-3 px-6 bg-violet-600 text-white rounded-full font-semibold transition-colors hover:bg-violet-700">
                            Submit Application
                        </button>
                    )}
                </footer>
            </div>
        </div>
    );
};

export default AgentApplicationForm;