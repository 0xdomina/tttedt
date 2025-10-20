import React from 'react';
import ChatScreen from './ChatScreen';
import UserVerifiedBadge from '../components/common/UserVerifiedBadge';
import { useUserStore, useUIStore } from '../store';
import type { Message, Conversation, User } from '../types';
import { useGetUsers, useGetConversations, useGetTeams } from '../hooks/useData';
import ConversationPreviewSkeleton from '../components/skeletons/ConversationPreviewSkeleton';

const ConversationPreview: React.FC<{ conversation: Conversation, onClick: () => void, isActive: boolean }> = ({ conversation, onClick, isActive }) => {
    const { currentUserId } = useUserStore();
    const { data: users, isLoading: isLoadingUsers } = useGetUsers();
    const { data: teams } = useGetTeams();
    const currentUser = users?.find(u => u.id === currentUserId);
    const team = teams?.find(t => t.id === conversation?.teamId);

    if (isLoadingUsers || !currentUser) return <ConversationPreviewSkeleton />;
    
    const otherParticipants = (conversation.participants || []).filter(p => p && p.id !== currentUser.id);
    const messages = conversation.messages || [];
    const lastMessage = messages[messages.length - 1];
    
    if (otherParticipants.length === 0 || !lastMessage) return null;

    const displayNames = team ? team.name : otherParticipants.map(p => p.name).join(', ');
    const displayUsernames = team ? '' : otherParticipants.map(p => `@${p.username}`).join(', ');
    const displayAvatar = team ? 'https://placehold.co/100x100/8b5cf6/ffffff?text=Team' : otherParticipants[0].avatar;
    
    const time = new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isUnread = !lastMessage.read && lastMessage.senderId !== currentUser.id;

    const getLastMessageContent = (message: Message) => {
        if (message.audio) return '🎤 Voice message';
        if (message.status === 'sending') return <span className="italic text-gray-500">Sending...</span>;
        if (message.status === 'failed') return <span className="italic text-red-500">Failed to send</span>;
        return message.text;
    };

    return (
        <article onClick={onClick} className={`flex items-start space-x-4 p-4 cursor-pointer border-b border-gray-100 ${isActive ? 'bg-violet-50' : 'hover:bg-gray-50'}`}>
            <img src={displayAvatar} alt={displayNames} className="w-14 h-14 rounded-full" loading="lazy" />
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5 truncate">
                            <h3 className={`font-bold text-gray-800 truncate ${isUnread ? 'font-extrabold' : ''}`}>{displayNames}</h3>
                            {!team && otherParticipants.map(p => <UserVerifiedBadge key={p.id} user={p} />)}
                            {team && <span className="text-xs font-semibold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-md">Team Search</span>}
                        </div>
                        {!team && <p className="text-sm text-gray-500 truncate">{displayUsernames}</p>}
                    </div>
                    <time className={`text-xs flex-shrink-0 ml-2 pt-1 ${isUnread ? 'text-violet-600 font-bold' : 'text-gray-500'}`}>{time}</time>
                </div>
                <p className={`text-sm mt-1 truncate ${isUnread ? 'text-gray-800 font-semibold' : 'text-gray-600'}`}>
                    {getLastMessageContent(lastMessage)}
                </p>
            </div>
             {isUnread && (
                <div className="w-3 h-3 bg-violet-500 rounded-full self-center flex-shrink-0"></div>
            )}
        </article>
    );
};

const MessagesScreen: React.FC = () => {
    const { data: conversations, isLoading } = useGetConversations();
    const { selectedConversationId, setSelectedConversationId } = useUIStore();

    return (
        <div className="flex w-full h-full">
            <div className={`w-full md:w-[380px] md:border-r md:border-gray-200 flex flex-col h-full bg-white ${selectedConversationId ? 'hidden md:flex' : 'flex'}`}>
                <main className="flex-grow overflow-y-auto no-scrollbar border-t border-gray-100 md:border-t-0">
                    <div>
                        {isLoading ? (
                           Array.from({ length: 5 }).map((_, i) => <ConversationPreviewSkeleton key={i} />)
                        ) : (conversations || []).map(convo => (
                            <ConversationPreview 
                                key={convo.id} 
                                conversation={convo}
                                onClick={() => setSelectedConversationId(convo.id)} 
                                isActive={selectedConversationId === convo.id}
                            />
                        ))}
                    </div>
                </main>
            </div>
            <div className={`w-full md:flex-1 ${selectedConversationId ? 'flex' : 'hidden md:flex'}`}>
                {selectedConversationId ? (
                    <ChatScreen key={selectedConversationId} />
                ) : (
                    <div className="hidden md:flex flex-col items-center justify-center w-full h-full bg-gray-50">
                        <h2 className="text-xl font-semibold text-gray-700">Select a conversation</h2>
                        <p className="text-gray-500 mt-2">Choose from your existing conversations to start chatting.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagesScreen;
