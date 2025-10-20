import React from 'react';
import { useUIStore } from '../../store';
import TenancyAgreement from './TenancyAgreement';
import { useGetUsers, useGetConversations } from '../../hooks/useData';
import { useUserStore } from '../../store';

const AgreementModal: React.FC = () => {
    const { modal, closeModal, selectedConversationId, selectedProperty } = useUIStore();
    const { currentUserId } = useUserStore();
    const { data: users } = useGetUsers();
    const { data: conversations } = useGetConversations();
    
    const currentUser = users?.find(u => u.id === currentUserId);
    const selectedConversation = conversations?.find(c => c.id === selectedConversationId);
    
    const isOpen = modal === 'agreement';

    if (!isOpen || !selectedConversation || !selectedProperty || !currentUser) {
        return null;
    }

    const handleSign = () => {
        // This would be a `useMutation` hook
        console.log('Agreement signed');
        closeModal();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeModal}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 text-center">Finalize Your Agreement</h2>
                </header>
                <main className="p-6 max-h-[60vh] overflow-y-auto">
                    <TenancyAgreement conversation={selectedConversation} property={selectedProperty} currentUser={currentUser} />
                </main>
                 <footer className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl flex flex-col items-center">
                    <button 
                        onClick={handleSign}
                        className="w-full max-w-xs py-2.5 text-sm font-semibold bg-violet-600 text-white rounded-full hover:bg-violet-700"
                    >
                        Agree to Terms & Finalize Deal
                    </button>
                    <button 
                        onClick={closeModal} 
                        className="mt-2 text-sm text-gray-600 hover:underline"
                    >
                        Cancel
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default AgreementModal;
