import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type View = 'auth' | 'dev-switcher' | 'app';

interface AppState {
  view: View;
  setView: (view: View) => void;
}

export const useAppStore = create(
  persist<AppState>(
    (set) => ({
      view: 'auth',
      setView: (view) => set({ view }),
    }),
    {
      name: 'edqorta-app-storage', 
      storage: createJSONStorage(() => localStorage),
    }
  )
);
