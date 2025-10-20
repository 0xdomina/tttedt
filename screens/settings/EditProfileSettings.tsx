import React, { useState, useRef, useEffect } from 'react';
import { User } from '../../types';
import { ArrowLeftIcon, CameraIcon } from '../../components/Icons';
import { useUserStore, useUIStore } from '../../store';
import { useGetUsers, useUpdateProfile } from '../../hooks/useData';

const EditProfileSettings: React.FC = () => {
  const { currentUserId } = useUserStore();
  const { data: users } = useGetUsers();
  const currentUser = users?.find(u => u.id === currentUserId);
  const { setSettingsView } = useUIStore();
  const updateProfileMutation = useUpdateProfile();

  const [name, setName] = useState(currentUser?.name || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const isChanged = currentUser ?
    name !== currentUser.name ||
    username !== currentUser.username ||
    bio !== (currentUser.bio || '') ||
    location !== (currentUser.location || '') ||
    avatarPreview !== null
    : false;

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleSaveChanges = () => {
    if (!currentUser) return;
    const updates: Partial<Pick<User, 'name' | 'username' | 'bio' | 'location' | 'avatar'>> = {};
    if (name !== currentUser.name) updates.name = name;
    if (username !== currentUser.username) updates.username = username;
    if (bio !== (currentUser.bio || '')) updates.bio = bio;
    if (location !== (currentUser.location || '')) updates.location = location;
    if (avatarPreview) updates.avatar = avatarPreview;
    
    if(Object.keys(updates).length > 0) {
      updateProfileMutation.mutate(updates, {
          onSuccess: () => setSettingsView('main'),
      });
    } else {
        setSettingsView('main');
    }
  };
  
  if (!currentUser) {
    return null; // or loading state
  }

  return (
    <div className="absolute inset-0 bg-white z-40 flex flex-col">
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-gray-200 p-4 flex items-center space-x-4">
        <button onClick={() => setSettingsView('main')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Edit Profile</h1>
      </header>
      
      <main className="flex-grow overflow-y-auto p-4 space-y-6">
        <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
                <img src={avatarPreview || currentUser.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover" loading="lazy" />
                <button
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
                    aria-label="Change profile picture"
                >
                    <CameraIcon className="w-8 h-8" />
                </button>
                <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
            </div>
        </div>

        <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500" />
        </div>
        <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100" />
        </div>
        <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500 resize-none" />
        </div>
        <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500" />
        </div>
      </main>
      <footer className="p-4 border-t border-gray-100">
        <button onClick={handleSaveChanges} disabled={!isChanged || updateProfileMutation.isPending} className="w-full py-2.5 bg-violet-600 text-white rounded-full font-semibold hover:bg-violet-700 disabled:bg-violet-300">
            {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </footer>
    </div>
  );
};

export default EditProfileSettings;
