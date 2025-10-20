import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore, useUserStore } from '../../store';
import SearchScreen from '../../screens/SearchScreen';
import PostScreen from '../../screens/PostScreen';
import MessagesScreen from '../../screens/MessagesScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import SideNav from './SideNav';
import BottomNav from './BottomNav';
import Header from './Header';
import HomeContainerScreen from '../../screens/HomeContainerScreen';
import StoryViewer from '../stories/StoryViewer';
import CommentsScreen from '../../screens/CommentsScreen';
import VerificationTaskModal from '../verification/VerificationTaskModal';
import VerificationCameraView from '../verification/VerificationCameraView';
import ConfirmationModal from '../common/ConfirmationModal';
import CreateTeamModal from '../teams/CreateTeamModal';
import NeighborhoodHubScreen from '../../screens/NeighborhoodHubScreen';
import PaymentModal from '../chat/PaymentModal';
import AgreementModal from '../chat/AgreementModal';
import TourSchedulingModal from '../tours/TourSchedulingModal';
import ReviewModal from '../profile/ReviewModal';
import SettingsScreen from '../../screens/SettingsScreen';
import EditProfileSettings from '../../screens/settings/EditProfileSettings';
import ChangePasswordSettings from '../../screens/settings/ChangePasswordSettings';
import PrivacySettings from '../../screens/settings/PrivacySettings';
import ReferralDashboardScreen from '../../screens/settings/ReferralDashboardScreen';
import NotificationsScreen from '../../screens/NotificationsScreen';
import AgentDashboardScreen from '../../screens/AgentDashboardScreen';
import BusinessDashboardScreen from '../../screens/BusinessDashboardScreen';
import VerifyScreen from '../../screens/VerifyScreen';
import ServicesScreen from '../../screens/ServicesScreen';
import MobileSideMenu from './MobileSideMenu';
import AgentApplicationForm from '../profile/AgentApplicationForm';
import { HomeIcon, SearchIcon, PlusCircleIcon, ChatBubbleIcon, UserCircleIcon } from '../Icons';
import { useGetUsers, useGetNotifications, useDeletePost, useCreateTeam, useUpdateProfile } from '../../hooks/useData';
import PropertyPostSkeleton from '../skeletons/PropertyPostSkeleton';
import NotificationManager from '../common/NotificationManager';

interface MainAppShellProps {
  onLogout: () => void;
}

const pageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const MainAppShell: React.FC<MainAppShellProps> = ({ onLogout }) => {
  const { 
    activeTab, setActiveTab, modal, closeModal, fullScreenView, closeFullScreen,
    fullScreenData, settingsView, openModal, selectedProperty, openFullScreen, 
    setSelectedConversationId, showNotification
  } = useUIStore();
  const { currentUserId } = useUserStore();
  const { data: users, isLoading: isLoadingUsers } = useGetUsers();
  const deletePostMutation = useDeletePost();
  const updateProfileMutation = useUpdateProfile();
  
  const createTeamMutation = useCreateTeam({
    onSuccess: (data) => {
      closeModal();
      setActiveTab('messages');
      setSelectedConversationId(data.newConversation.id);
    },
  });

  const { data: notificationsData } = useGetNotifications();
  const notifications = notificationsData || [];
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const currentUser = users?.find(u => u.id === currentUserId);

  const navItems = [
    { tab: 'home' as const, label: 'Home', icon: HomeIcon, screen: <HomeContainerScreen /> },
    { tab: 'search' as const, label: 'Search', icon: SearchIcon, screen: <SearchScreen /> },
    { tab: 'post' as const, label: 'Post', icon: PlusCircleIcon, screen: <PostScreen /> },
    { tab: 'messages' as const, label: 'Messages', icon: ChatBubbleIcon, screen: <MessagesScreen /> },
    { tab: 'profile' as const, label: 'Profile', icon: UserCircleIcon, screen: <ProfileScreen profileUserId={null} /> },
  ];
  
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const renderContent = () => {
    const activeItem = navItems.find(item => item.tab === activeTab);
    return (
      <motion.div
        key={activeTab}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.2 }}
        className="w-full h-full"
      >
        {activeItem ? activeItem.screen : <HomeContainerScreen />}
      </motion.div>
    );
  };
  
  const handleNavigate = (view: 'dashboard' | 'verify' | 'settings' | 'services') => {
    if (!currentUser) return;
    closeModal();
    setIsMobileMenuOpen(false);
    if(view === 'dashboard') {
      openFullScreen('dashboard');
    } else {
      openFullScreen(view);
    }
  };

  const handleAgentApplicationSubmit = () => {
    updateProfileMutation.mutate({ agentStatus: 'pending' }, {
      onSuccess: () => {
        closeModal();
        showNotification({ type: 'success', message: 'Application submitted successfully!' });
      },
      onError: () => {
        closeModal();
        showNotification({ type: 'error', message: 'Failed to submit application.' });
      }
    });
  };
  
  if (isLoadingUsers || !currentUser) {
    return <div className="p-4"><PropertyPostSkeleton /></div>;
  }

  const renderModal = () => {
    switch (modal) {
      case 'story': return <StoryViewer onClose={closeModal} />;
      case 'comments': return <CommentsScreen />;
      case 'verificationTask': return <VerificationTaskModal onAccept={() => { openFullScreen('dashboard', { showCamera: true }); closeModal();}} onDecline={closeModal} />;
      case 'deletePost': return <ConfirmationModal isOpen={true} onClose={closeModal} onConfirm={() => { if(selectedProperty) deletePostMutation.mutate(selectedProperty.id); closeModal(); }} title="Delete Post?" message="This action cannot be undone." confirmText="Delete" />;
      case 'blockUser': return <ConfirmationModal isOpen={true} onClose={closeModal} onConfirm={() => { alert('User blocked.'); closeModal(); }} title="Block User?" message="They won't be able to see your posts or message you." confirmText="Block" />;
      case 'createTeam': return <CreateTeamModal onClose={closeModal} onCreateTeam={(name, members) => createTeamMutation.mutate({ name, memberIds: members })} />;
      case 'neighborhood': return <NeighborhoodHubScreen />;
      case 'payment': return <PaymentModal isOpen={true} onClose={closeModal} onConfirm={() => { alert('Payment successful'); closeModal(); }} />;
      case 'agreement': return <AgreementModal />;
      case 'scheduleTour': return <TourSchedulingModal isOpen={true} onClose={closeModal} onSubmit={(propertyId, times) => { console.log('addTour would be a mutation', { propertyId, times }); closeModal(); }} />;
      case 'review': return <ReviewModal isOpen={true} onClose={closeModal} onSubmit={() => { alert('Review submitted'); closeModal(); }} />;
      case 'agentApplication': return <AgentApplicationForm onClose={closeModal} onSubmit={handleAgentApplicationSubmit} />;
      default: return null;
    }
  };

  const renderFullScreen = () => {
    let content = null;
    switch(fullScreenView) {
      case 'profile': content = <ProfileScreen profileUserId={fullScreenData?.profileUserId || null} />; break;
      case 'notifications': content = <NotificationsScreen />; break;
      case 'settings':
        switch(settingsView) {
          case 'main': content = <SettingsScreen />; break;
          case 'editProfile': content = <EditProfileSettings />; break;
          case 'changePassword': content = <ChangePasswordSettings />; break;
          case 'privacy': content = <PrivacySettings />; break;
          case 'referral': content = <ReferralDashboardScreen />; break;
          default: content = <SettingsScreen />;
        }
        break;
      case 'dashboard':
        if (fullScreenData?.showCamera) return <VerificationCameraView onClose={closeFullScreen} onSubmit={() => { alert('Verification Submitted!'); closeFullScreen(); }} />;
        content = currentUser.accountType === 'business' ? <BusinessDashboardScreen /> : <AgentDashboardScreen />;
        break;
      case 'verify': content = <VerifyScreen />; break;
      case 'services': content = <ServicesScreen />; break;
      default: return null;
    }
    return (
        <motion.div
            key={fullScreenView}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
        >
            {content}
        </motion.div>
    )
  }

  const getHeaderTitle = () => {
    if (fullScreenView) {
        switch(fullScreenView) {
            case 'profile': return 'Profile';
            case 'notifications': return 'Notifications';
            case 'settings': return 'Settings';
            case 'dashboard': return currentUser.accountType === 'business' ? 'Business Hub' : 'Agent Dashboard';
            case 'verify': return 'Verification';
            case 'services': return 'Services';
            default: return '';
        }
    }
    const activeItem = navItems.find(item => item.tab === activeTab);
    return activeTab === 'home' ? 'edQorta' : (activeItem?.label || 'edQorta');
  };

  return (
    <div className="flex h-screen w-screen bg-white md:bg-gray-100 text-gray-800">
      <NotificationManager />
      <SideNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        navItems={navItems} 
        currentUser={currentUser}
        onNavigate={handleNavigate}
        onLogout={onLogout}
      />
      <MobileSideMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentUser={currentUser}
        onNavigate={handleNavigate}
        onLogout={onLogout}
      />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header 
          title={getHeaderTitle()} 
          unreadCount={unreadNotifications} 
          onNotificationClick={() => openFullScreen('notifications')}
          showBack={!!fullScreenView}
          onBack={closeFullScreen}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        <div className="flex-1 relative overflow-y-auto no-scrollbar">
            <AnimatePresence mode="wait">
                {fullScreenView ? renderFullScreen() : renderContent()}
            </AnimatePresence>
        </div>
      </div>
      <BottomNav />
      <AnimatePresence>
        {modal && renderModal()}
      </AnimatePresence>
    </div>
  );
};

export default MainAppShell;