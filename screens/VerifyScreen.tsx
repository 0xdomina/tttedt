import React from 'react';
import { ShieldCheckIcon, UserCircleIcon, CheckmarkBadgeIcon } from '../components/Icons';
import { useUIStore } from '../store';

const BenefitItem: React.FC<{ text: string }> = ({ text }) => (
    <li className="flex items-start gap-2">
        <CheckmarkBadgeIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
        <span>{text}</span>
    </li>
);

const VerifyScreen: React.FC = () => {
    const { openModal } = useUIStore();

    return (
        <div className="w-full h-full flex justify-center">
            <div className="w-full max-w-2xl bg-white">
                <main className="flex-grow overflow-y-auto no-scrollbar p-4 sm:p-6 space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800">edQorta Verification</h2>
                        <p className="mt-2 text-gray-600 max-w-xl mx-auto">Build trust and unlock exclusive features by getting verified. Choose the verification path that's right for you.</p>
                    </div>

                    <div className="space-y-6">
                        {/* Individual Realtor/Agent Verification */}
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                            <div className="flex items-center gap-4">
                                <UserCircleIcon className="w-10 h-10 text-blue-500" />
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">For Individual Realtors/Agents</h3>
                                    <p className="text-sm text-gray-500">Become a trusted agent in the community.</p>
                                </div>
                            </div>
                            <div className="mt-4 pl-2 text-gray-700 space-y-2">
                                <ul className="space-y-2">
                                    <BenefitItem text="Receive a blue verified agent badge on your profile." />
                                    <BenefitItem text="Earn commissions by verifying properties." />
                                    <BenefitItem text="Get access to the Agent Dashboard to manage tasks." />
                                    <BenefitItem text="Increased visibility and trust from potential clients." />
                                </ul>
                            </div>
                            <button 
                                onClick={() => openModal('agentApplication')}
                                className="w-full mt-6 py-2.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700"
                            >
                                Verify as an Agent
                            </button>
                        </div>

                        {/* Business/Company Verification */}
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                             <div className="flex items-center gap-4">
                                <ShieldCheckIcon className="w-10 h-10 text-green-500" />
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">For Businesses & Companies</h3>
                                    <p className="text-sm text-gray-500">For agencies, hotels, and shortlet providers.</p>
                                </div>
                            </div>
                            <div className="mt-4 pl-2 text-gray-700 space-y-2">
                                <ul className="space-y-2">
                                    <BenefitItem text="Get a green verified business badge for maximum trust." />
                                    <BenefitItem text="Unlock advanced posting options (e.g., price per night, week, month)." />
                                    <BenefitItem text="List your company profile and gain corporate visibility." />
                                    <BenefitItem text="Access business-specific analytics and tools." />
                                </ul>
                            </div>
                            <button className="w-full mt-6 py-2.5 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700">
                                Verify as a Business
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default VerifyScreen;