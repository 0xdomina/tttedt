
import React, { useState, useRef, useEffect } from 'react';
import PostForm from './PostForm';
// FIX: Changed import for NewPropertyData to come from the central types file.
import type { NewPropertyData } from '../../types';
import { User } from '../../types';

interface PostComposerProps {
    onCreatePost: (data: NewPropertyData) => Promise<void>;
    currentUser: User;
    onAddStory: (file: File) => void;
}

const PostComposer: React.FC<PostComposerProps> = ({ onCreatePost, currentUser, onAddStory }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const composerRef = useRef<HTMLDivElement>(null);

    // Click outside to collapse
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (composerRef.current && !composerRef.current.contains(event.target as Node)) {
                setIsExpanded(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={composerRef} className="p-4 border-b border-gray-200 bg-white">
            <div className="flex space-x-3">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-12 h-12 rounded-full" loading="lazy" />
                <div className="flex-1">
                    {isExpanded ? (
                        <PostForm 
                            onSubmit={onCreatePost} 
                            currentUser={currentUser} 
                            onAddStory={onAddStory}
                            onCancel={() => setIsExpanded(false)}
                            onPostSuccess={() => setIsExpanded(false)}
                        />
                    ) : (
                        <div 
                            onClick={() => setIsExpanded(true)}
                            className="w-full h-12 flex items-center px-4 bg-gray-100 rounded-full cursor-text hover:bg-gray-200 transition-colors"
                        >
                            <p className="text-gray-500">Create a new post...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostComposer;
