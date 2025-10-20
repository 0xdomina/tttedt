import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { currentUserId as mockCurrentUserId } from '../data/mockData';

// This store now ONLY manages the current user's session ID.
// All user data fetching and mutations (like follow, update profile) are handled by React Query.

interface UserState {
  currentUserId: number;
  setCurrentUserId: (userId: number) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUserId: mockCurrentUserId,
      setCurrentUserId: (userId) => {
        set({ currentUserId: userId });
      },
    }),
    {
      name: 'edqorta-user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ currentUserId: state.currentUserId }),
    }
  )
);
