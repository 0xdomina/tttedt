import React from 'react';
import { Conversation, Property, User } from '../../types';
import { DocumentDownloadIcon, ClockIcon } from '../Icons';

interface TenancyAgreementProps {
    conversation: Conversation;
    property: Property;
    currentUser: User;
}

const TenancyAgreement: React.FC<TenancyAgreementProps> = ({ conversation, property, currentUser }) => {
    const lister = property.lister;
    const renter = conversation.participants.find(p => 
        p && p.id !== lister.id && 
        (!property.verifier || p.id !== property.verifier.id)
    );
    
    return (
        <div className="my-4 p-4 border border-violet-200 bg-violet-50 rounded-lg">
            <h3 className="font-bold text-center text-violet-800">Digital Tenancy Agreement</h3>
            <div className="mt-4 text-sm text-gray-700 space-y-2">
                <p><strong>Property:</strong> {property.location}</p>
                <p><strong>Landlord/Lister:</strong> {lister.name} (@{lister.username})</p>
                <p><strong>Tenant:</strong> {renter ? `${renter.name} (@${renter.username})` : 'N/A'}</p>
                <p><strong>Rent Amount:</strong> ₦{property.price?.toLocaleString()}</p>
                <p className="text-xs text-gray-500 pt-2">This document serves as a binding agreement upon acceptance. Please review carefully.</p>
            </div>
            
            <div className="mt-4">
                {conversation.dealStatus === 'agreement_pending' && (
                     <div className="text-center p-2 bg-yellow-100 rounded-lg">
                        <p className="font-semibold text-yellow-800 flex items-center justify-center gap-2">
                          <ClockIcon className="w-4 h-4" />
                          Awaiting your signature...
                        </p>
                    </div>
                )}
                {conversation.dealStatus === 'complete' && (
                    <div className="text-center p-2 bg-green-100 rounded-lg">
                        <p className="font-semibold text-green-800">✓ Deal Complete! Funds have been released.</p>
                        <button className="mt-2 flex items-center justify-center gap-2 w-full py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700">
                            <DocumentDownloadIcon className="w-4 h-4" />
                            Download PDF
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TenancyAgreement;