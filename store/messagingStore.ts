import { create } from 'zustand';
import { useUIStore } from './uiStore';
import { Property, User } from '../types';

// This store is now for client-side only state and navigation actions.
// All data fetching and mutations are handled by React Query.

interface MessagingState {
    startDM: (userId: number) => void;
    startPropertyChat: (lister: User, property: Property) => void;
}

export const useMessagingStore = create<MessagingState>((set, get) => ({
    startDM: (userId) => {
        // In a real app, this might involve a mutation to create a conversation if one doesn't exist.
        // For now, it just navigates.
        console.log(`Starting DM with user ${userId}`);
        useUIStore.getState().setActiveTab('messages');
        // A real implementation would then set the correct selectedConversationId
    },
    startPropertyChat: (lister, property) => {
        // In a real app, this would be a mutation to find or create the conversation.
        // For now, it navigates and opens a mock conversation.
        console.log(`Starting chat about property ${property.id} with lister ${lister.id}`);
        useUIStore.getState().setActiveTab('messages');
        // For the mock, we can find a relevant conversation. A real app would get this from the mutation response.
        if (property.id === 1) { // Hardcoded for mock data example
             useUIStore.getState().setSelectedConversationId(1);
        }
    },
}));
