import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Property } from '../types';

export type Tab = 'home' | 'search' | 'post' | 'messages' | 'profile' | 'discover';

export type ModalType = 'story' | 'comments' | 'verificationTask' | 'deletePost' | 'blockUser' | 'createTeam' | 'neighborhood' | 'payment' | 'agreement' | 'scheduleTour' | 'review' | 'agentApplication';

export type FullScreenView = 'profile' | 'notifications' | 'settings' | 'dashboard' | 'verify' | 'services';
export type SettingsScreenView = 'main' | 'editProfile' | 'changePassword' | 'privacy' | 'referral';

export interface Notification {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface UIState {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  
  modal: ModalType | null;
  modalData: any;
  openModal: (modal: ModalType, data?: any) => void;
  closeModal: () => void;

  selectedStoryUser: User | null;
  selectedProperty: Property | null;
  selectedUser: User | null; // For reviews, etc.
  selectedConversationId: number | null;
  setSelectedConversationId: (id: number | null) => void;
  setSelectedProperty: (property: Property | null) => void;
  
  fullScreenView: FullScreenView | null;
  fullScreenData: any;
  openFullScreen: (view: FullScreenView, data?: any) => void;
  closeFullScreen: () => void;
  viewProfile: (userId: number) => void;

  settingsView: SettingsScreenView;
  setSettingsView: (view: SettingsScreenView) => void;

  searchInitialState: { query: string, coords: { lat: number, lng: number }, viewMode: 'map' | 'list' } | null;
  viewOnMap: (query: string, coords: { lat: number, lng: number }) => void;
  clearInitialSearchState: () => void;

  // --- Router State ---
  _isUpdatingFromUrl: boolean;
  initRouter: () => void;
  
  notifications: Notification[];
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  dismissNotification: (id: number) => void;
}

const parseHash = () => {
    const hash = window.location.hash.slice(1);
    const [path, ...params] = hash.split('/');
    if (!path) return { view: 'home' };

    switch (path) {
        case 'profile': return { view: 'profile', data: { profileUserId: parseInt(params[0], 10) } };
        case 'post': return { view: 'comments', data: { propertyId: parseInt(params[0], 10) } }; // Opens comments modal for a post
        case 'settings': return { view: 'settings' };
        case 'notifications': return { view: 'notifications' };
        case 'dashboard': return { view: 'dashboard' };
        case 'verify': return { view: 'verify' };
        case 'services': return { view: 'services' };
        default: return { view: 'tab', data: { tab: path as Tab } };
    }
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      activeTab: 'home',
      setActiveTab: (tab) => {
        set({ activeTab: tab, fullScreenView: null });
        if (!get()._isUpdatingFromUrl) window.location.hash = tab;
      },

      modal: null,
      modalData: null,
      openModal: (modal, data = {}) => {
        set({ modal, modalData: data });
        if (modal === 'comments' && data.property) {
           if (!get()._isUpdatingFromUrl) window.location.hash = `/post/${data.property.id}`;
        }
      },
      closeModal: () => {
        set({ modal: null, modalData: null });
        if (!get()._isUpdatingFromUrl) window.location.hash = get().activeTab;
      },

      selectedStoryUser: null,
      selectedProperty: null,
      selectedUser: null,
      selectedConversationId: null,
      setSelectedConversationId: (id) => set({ selectedConversationId: id }),
      setSelectedProperty: (property) => set({ selectedProperty: property }),

      fullScreenView: null,
      fullScreenData: null,
      openFullScreen: (view, data = {}) => {
        set({ fullScreenView: view, fullScreenData: data });
        if (!get()._isUpdatingFromUrl) {
            if (view === 'profile' && data.profileUserId) {
                window.location.hash = `/profile/${data.profileUserId}`;
            } else {
                window.location.hash = view;
            }
        }
      },
      closeFullScreen: () => {
        set({ fullScreenView: null, fullScreenData: null });
        if (!get()._isUpdatingFromUrl) window.location.hash = get().activeTab;
      },
      viewProfile: (userId) => {
        get().openFullScreen('profile', { profileUserId: userId });
      },

      settingsView: 'main',
      setSettingsView: (view) => set({ settingsView: view }),

      searchInitialState: null,
      viewOnMap: (query, coords) => {
        set({ activeTab: 'search', searchInitialState: { query, coords, viewMode: 'map' } });
      },
      clearInitialSearchState: () => set({ searchInitialState: null }),
      
      _isUpdatingFromUrl: false,
      initRouter: () => {
        const handleHashChange = () => {
            set({ _isUpdatingFromUrl: true });
            const { view, data } = parseHash();

            // Reset all views first
            set({ modal: null, fullScreenView: null });

            if(view === 'home' || view === 'tab') {
                set({ activeTab: data?.tab || 'home' });
            } else if (view === 'profile') {
                get().openFullScreen('profile', data);
            } else if (view === 'comments') {
                // This requires properties to be loaded to set the selectedProperty
                // A real app might fetch the property here if not available
                get().openModal('comments', { property: { id: data.propertyId } });
            } else if (['settings', 'notifications', 'dashboard', 'verify', 'services'].includes(view)) {
                 get().openFullScreen(view as FullScreenView);
            }

            // A short timeout prevents infinite loops if state changes cause hash changes
            setTimeout(() => set({ _isUpdatingFromUrl: false }), 50);
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Initial load
        
        // Return a cleanup function
        return () => window.removeEventListener('hashchange', handleHashChange);
      },

      notifications: [],
      showNotification: (notification) => {
        const newNotification = { ...notification, id: Date.now() };
        set(state => ({ notifications: [...state.notifications, newNotification] }));
      },
      dismissNotification: (id) => {
        set(state => ({ notifications: state.notifications.filter(n => n.id !== id) }));
      },
    }),
    {
      name: 'edqorta-ui-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        activeTab: state.activeTab, 
        settingsView: state.settingsView,
      }),
    }
  )
);