import { create } from 'zustand';
import { ScheduledTour } from '../types';

// This store is now for client-side only state or actions not covered by mutations.
// All data (neighborhoods, tours, etc.) is fetched via React Query hooks.

interface AppDataState {
    // Actions are now mutations in React Query
    addTour: (propertyId: number, proposedTimes: string[]) => void;
    confirmTour: (tourId: number, time: string) => void;
    addQuestion: (neighborhoodId: number, text: string) => void;
    addAnswer: (neighborhoodId: number, questionId: number, text: string) => void;
}

export const useAppDataStore = create<AppDataState>((set, get) => ({
    // In a real app, these would be `useMutation` hooks.
    addTour: (propertyId, proposedTimes) => console.log('addTour would be a mutation', { propertyId, proposedTimes }),
    confirmTour: (tourId, time) => console.log('confirmTour would be a mutation', { tourId, time }),
    addQuestion: (neighborhoodId, text) => console.log('addQuestion would be a mutation', { neighborhoodId, text }),
    addAnswer: (neighborhoodId, questionId, text) => console.log('addAnswer would be a mutation', { neighborhoodId, questionId, text }),
}));
