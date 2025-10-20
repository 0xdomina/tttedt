import React, { useRef } from 'react';
import { User } from '../../types';
import { PlusCircleIcon } from '../Icons';

interface StoryTrayProps {
  currentUser: User;
  usersWithStories: User[];
  onAddStory: (file: File) => void;
  onViewStory: (user: User) => void;
}

const StoryItem: React.FC<{ user: User; onClick: () => void }> = ({ user, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 flex-shrink-0 w-20 text-center">
        <div className="p-0.5 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500">
            <div className="p-0.5 bg-white rounded-full">
                 <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover" loading="lazy" />
            </div>
        </div>
        <p className="text-xs font-medium text-gray-700 truncate w-full">{user.name}</p>
    </button>
);

const AddStoryItem: React.FC<{ user: User, onAddStory: (file: File) => void }> = ({ user, onAddStory }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const handleAddClick = () => inputRef.current?.click();
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onAddStory(file);
        }
    };

    return (
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0 w-20 text-center">
            <button onClick={handleAddClick} className="relative w-[70px] h-[70px] flex items-center justify-center">
                <img src={user.avatar} alt="Your Story" className="w-16 h-16 rounded-full object-cover" loading="lazy" />
                <div className="absolute bottom-0 right-0 bg-white rounded-full">
                    <PlusCircleIcon isActive className="text-violet-600 h-6 w-6" />
                </div>
            </button>
            <p className="text-xs font-medium text-gray-700">Your Story</p>
            <input type="file" ref={inputRef} className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
        </div>
    );
};


const StoryTray: React.FC<StoryTrayProps> = ({ currentUser, usersWithStories, onAddStory, onViewStory }) => {
    const otherUsersWithStories = usersWithStories.filter(u => u.id !== currentUser.id);

    return (
        <div className="p-3">
            <div className="flex items-start space-x-4 overflow-x-auto no-scrollbar">
                <AddStoryItem user={currentUser} onAddStory={onAddStory} />
                {otherUsersWithStories.map(user => (
                    <StoryItem key={user.id} user={user} onClick={() => onViewStory(user)} />
                ))}
            </div>
        </div>
    );
};

export default StoryTray;