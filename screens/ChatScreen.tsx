

import React, { useState, useEffect, useRef } from 'react';
import { useUIStore, useUserStore } from '../store';
import { ArrowLeftIcon, SendIcon, MicrophoneIcon, UsersIcon, ClipboardListIcon, CalendarIcon, CashIcon, CreditCardIcon, ClockIcon, ShieldExclamationIcon } from '../components/Icons';
import UserVerifiedBadge from '../components/common/UserVerifiedBadge';
import AudioPlayer from '../components/chat/AudioPlayer';
import PropertyCard from '../components/property/PropertyCard';
import TeamPropertiesView from '../components/teams/TeamPropertiesView';
import TenancyAgreement from '../components/chat/TenancyAgreement';
import { Message, User } from '../types';
// FIX: Replaced useMessagingStore with the correct data hooks from React Query.
import { useGetUsers, useGetProperties, useGetConversations, useGetTeams, useSendMessage, useAddTeamComment } from '../hooks/useData';

const MessageBubble: React.FC<{ message: Message; isOwn: boolean; sender: User | null; isGroup: boolean; onRetry: () => void; }> = ({ message, isOwn, sender, isGroup, onRetry }) => {
    const bubbleClass = isOwn ? 'bg-violet-600 text-white rounded-l-2xl rounded-tr-2xl' : 'bg-gray-200 text-gray-800 rounded-r-2xl rounded-tl-2xl';
    
    if (message.type === 'system') {
        return <div className="text-center text-xs text-gray-500 py-3 px-2">{message.text}</div>;
    }

    const mainContent = (
        <div className={`p-3 ${bubbleClass} ${message.status === 'sending' ? 'opacity-70' : ''}`}>
            {!isOwn && isGroup && sender && <p className="text-xs font-bold mb-1 text-violet-700">{sender.name}</p>}
            {message.text && <p className="text-sm break-words">{message.text}</p>}
            {message.audio && <AudioPlayer audioUrl={message.audio.url} duration={message.audio.duration} />}
        </div>
    );

    if (isOwn) {
        return (
            <div className="self-end flex items-end gap-2 max-w-xs sm:max-w-md">
                {mainContent}
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center mb-1">
                    {message.status === 'sending' && <ClockIcon className="w-4 h-4 text-gray-400" />}
                    {message.status === 'failed' && (
                        <button onClick={onRetry} title="Failed to send. Click to retry.">
                            <ShieldExclamationIcon className="w-5 h-5 text-red-500" />
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
         <div className="self-start flex items-end gap-2 max-w-xs sm:max-w-md">
             {!isOwn && isGroup && sender && (
                <img src={sender.avatar} alt={sender.name} className="w-6 h-6 rounded-full mb-1 flex-shrink-0" loading="lazy" />
            )}
            {mainContent}
        </div>
    );
};


const ChatScreen: React.FC = () => {
    const { selectedConversationId, setSelectedConversationId, openModal, setSelectedProperty } = useUIStore();
    const { currentUserId } = useUserStore();
    const { data: users, isLoading: isLoadingUsers } = useGetUsers();
    const { data: properties, isLoading: isLoadingProperties } = useGetProperties();
    // FIX: Get conversations, teams, and mutations from React Query hooks instead of the old store.
    const { data: conversations } = useGetConversations();
    const { data: teams } = useGetTeams();
    const { mutate: sendMessage } = useSendMessage();
    const { mutate: addTeamComment } = useAddTeamComment();

    const currentUser = users?.find(u => u.id === currentUserId);

    const conversation = conversations?.find(c => c.id === selectedConversationId);
    
    // Set selected property for modals
    const property = conversation?.propertyId ? properties?.find(p => p.id === conversation.propertyId) : null;
    useEffect(() => {
        if (property) {
            setSelectedProperty(property);
        }
        return () => {
             // Clean up selected property when unmounting or changing conversation
             if (property) {
                setSelectedProperty(null);
             }
        };
    }, [conversation, property, properties, setSelectedProperty]);
    
    const team = conversation?.teamId ? teams?.find(t => t.id === conversation.teamId) : null;

    const [newMessage, setNewMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'chat' | 'properties'>('chat');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView();
    }, [conversation?.messages, activeTab]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && selectedConversationId) {
            sendMessage({ conversationId: selectedConversationId, text: newMessage.trim() });
            setNewMessage('');
        }
    };

    // FIX: Implement a resend function that re-uses the send message mutation.
    const resendMessage = (conversationId: number, message: Message) => {
        if (message.text) {
            sendMessage({ conversationId, text: message.text });
            // Note: A more robust implementation would replace the failed message optimistically.
        }
    };
    
    if (isLoadingUsers || isLoadingProperties || !conversation || !currentUser) {
        return <div className="hidden md:flex flex-col items-center justify-center w-full h-full bg-gray-50"><h2 className="text-xl font-semibold text-gray-700">No conversation selected</h2></div>;
    }
    
    const otherParticipants = conversation.participants.filter(p => p && p.id !== currentUser.id);
    const headerTitle = team ? team.name : otherParticipants.map(p => p.name).join(', ');
    const isGroup = conversation.participants.length > 2 || !!team;

    // Business logic for contextual buttons with clear hierarchy
    const showAgreementButton = conversation.dealStatus === 'agreement_pending' && property;
    const showPaymentButton = conversation.dealStatus === 'payment_pending' && property;
    
    // These only show if a higher-priority action isn't available
    const showBookNowButton = !showAgreementButton && !showPaymentButton && property && ['night', 'day', 'week'].includes(property.priceInterval || '');
    const showScheduleTourButton = !showAgreementButton && !showPaymentButton && property && (property.type === 'sale' || ['year', 'month'].includes(property.priceInterval || ''));


    return (
        <div className="flex flex-col h-full w-full bg-white">
            <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-3 flex items-center space-x-3 border-b border-gray-200">
                <button onClick={() => setSelectedConversationId(null)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 md:hidden">
                    <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <div className="flex-1 flex items-center gap-3 min-w-0">
                    <img src={team ? 'https://placehold.co/100x100/8b5cf6/ffffff?text=Team' : (otherParticipants[0]?.avatar || '')} alt={headerTitle} className="w-10 h-10 rounded-full" loading="lazy" />
                    <div className="min-w-0">
                        <h2 className="font-bold text-gray-800 truncate">{headerTitle}</h2>
                        {!team && <p className="text-sm text-gray-500 truncate">{otherParticipants.map(p => `@${p.username}`).join(', ')}</p>}
                    </div>
                </div>
                {team && (
                    <div className="flex items-center gap-1">
                        <button onClick={() => setActiveTab('chat')} className={`p-2 rounded-full ${activeTab === 'chat' ? 'bg-violet-100' : 'hover:bg-gray-100'}`} title="View Chat"><UsersIcon className={`w-5 h-5 ${activeTab === 'chat' ? 'text-violet-600' : 'text-gray-600'}`} /></button>
                        <button onClick={() => setActiveTab('properties')} className={`p-2 rounded-full ${activeTab === 'properties' ? 'bg-violet-100' : 'hover:bg-gray-100'}`} title="View Shared Properties"><ClipboardListIcon className={`w-5 h-5 ${activeTab === 'properties' ? 'text-violet-600' : 'text-gray-600'}`} /></button>
                    </div>
                )}
            </header>

            <main className="flex-grow overflow-y-auto no-scrollbar bg-gray-50">
                {team && activeTab === 'properties' && properties ? (
                    // FIX: Removed `onAddComment` prop as it's not defined in `TeamPropertiesViewProps`. The child component handles its own mutation.
<TeamPropertiesView team={team} allProperties={properties} currentUser={currentUser} />
                ) : (
                    <div className="p-4 space-y-4">
                        {property && (
                            <div className="p-2 bg-white rounded-lg border">
                                <PropertyCard property={property} />
                            </div>
                        )}
                        {conversation.dealStatus && property && (
                            <TenancyAgreement conversation={conversation} property={property} currentUser={currentUser} />
                        )}

                        {conversation.messages.map(message => {
                            const isOwn = message.senderId === currentUser.id;
                            const sender = message.senderId === 0 ? null : users?.find(u => u.id === message.senderId) || null;
                            return <MessageBubble key={message.id} message={message} isOwn={isOwn} sender={sender} isGroup={isGroup} onRetry={() => resendMessage(conversation.id, message)} />;
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </main>
            
            <footer className="p-3 bg-white border-t border-gray-100">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    {/* Primary Action Buttons based on context */}
                    {showAgreementButton && (
                         <button type="button" onClick={() => openModal('agreement')} className="p-3 text-gray-500 rounded-full hover:bg-gray-100" aria-label="Review agreement">
                            <ClipboardListIcon className="w-6 h-6"/>
                        </button>
                    )}
                    {showPaymentButton && (
                        <button type="button" onClick={() => openModal('payment')} className="p-3 text-gray-500 rounded-full hover:bg-gray-100" aria-label="Make payment">
                            <CashIcon className="w-6 h-6"/>
                        </button>
                    )}
                    {showBookNowButton && (
                        <button type="button" onClick={() => openModal('payment')} className="p-3 text-gray-500 rounded-full hover:bg-gray-100" aria-label="Book now">
                            <CreditCardIcon className="w-6 h-6"/>
                        </button>
                    )}
                    {showScheduleTourButton && (
                        <button type="button" onClick={() => openModal('scheduleTour')} className="p-3 text-gray-500 rounded-full hover:bg-gray-100" aria-label="Schedule a tour">
                            <CalendarIcon className="w-6 h-6"/>
                        </button>
                    )}
                    
                    {/* Secondary Action Buttons */}
                    <button type="button" className="p-3 text-gray-500 rounded-full hover:bg-gray-100" aria-label="Record audio message">
                        <MicrophoneIcon className="w-6 h-6"/>
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-grow px-4 py-3 bg-gray-100 rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-violet-500 caret-black"
                        aria-label="Message input"
                    />
                    <button type="submit" className="p-3 bg-violet-600 text-white rounded-full hover:bg-violet-700 disabled:bg-violet-300" disabled={!newMessage.trim()} aria-label="Send message">
                        <SendIcon className="w-6 h-6"/>
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default ChatScreen;