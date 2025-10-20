
import React from 'react';
import PostComposer from '../components/post/PostComposer';
import { useUserStore, useUIStore } from '../store';
// FIX: Changed import for NewPropertyData to come from the central types file.
import type { NewPropertyData } from '../types';
import { useCreatePost, useGetUsers } from '../hooks/useData';
import PropertyPostSkeleton from '../components/skeletons/PropertyPostSkeleton';

const PostScreen: React.FC = () => {
    const { currentUserId } = useUserStore();
    const { data: users, isLoading } = useGetUsers();
    const currentUser = users?.find(u => u.id === currentUserId);
    const createPostMutation = useCreatePost();
    const { setActiveTab } = useUIStore();

    const handleCreatePost = async (data: NewPropertyData) => {
        await createPostMutation.mutateAsync(data);
        alert('Post created successfully!');
        setActiveTab('home'); // Go to home after posting
    };

    const handleAddStory = (file: File) => {
        alert(`Story "${file.name}" added! This feature is a work in progress.`);
        setActiveTab('home');
    };

    if (isLoading || !currentUser) {
        return <PropertyPostSkeleton />;
    }

    return (
        <div className="w-full h-full bg-white pt-4">
            <div className="max-w-2xl mx-auto">
                 <PostComposer 
                    currentUser={currentUser}
                    onCreatePost={handleCreatePost}
                    onAddStory={handleAddStory}
                 />
            </div>
        </div>
    );
};

export default PostScreen;
