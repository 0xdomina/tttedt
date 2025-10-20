import { create } from 'zustand';
import { Property } from '../types';

interface PropertyState {
    // This store is now for client-side state related to properties
    togglePropertyAvailability: (propertyId: number) => void;
}

export const usePropertyStore = create<PropertyState>((set, get) => ({
    // Note: 'properties' and server-side actions are now managed by React Query
    togglePropertyAvailability: (propertyId) => {
      // This is a client-side only action in the mock. In a real app, this would be a mutation.
      console.log('Toggling availability for:', propertyId);
    }
}));
