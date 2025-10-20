import React, { useState, useEffect, useRef, useMemo } from 'react';
import { User, Story } from '../../types';
import { CloseIcon, ArrowLeftIcon, ArrowRightIcon } from '../Icons';
import { useUIStore } from '../../store';
import { useGetUsers } from '../../hooks/useData';

interface StoryViewerProps {
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ onClose }) => {
    const { data: users } = useGetUsers();
    const { selectedStoryUser } = useUIStore();

    const usersWithStories = useMemo(() => users?.filter(u => u.stories && u.stories.length > 0) || [], [users]);

    const [currentUserIndex, setCurrentUserIndex] = useState(() => 
        selectedStoryUser ? usersWithStories.findIndex(u => u.id === selectedStoryUser.id) : -1
    );
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const currentUser = usersWithStories[currentUserIndex];
    
    if (!currentUser) return null; // Or some error/loading state
    
    const currentStory = currentUser.stories[currentStoryIndex];

    const goToNextStory = () => {
        if (currentStoryIndex < currentUser.stories.length - 1) {
            setCurrentStoryIndex(prev => prev + 1);
        } else {
            goToNextUser();
        }
    };

    const goToPrevStory = () => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(prev => prev - 1);
        } else {
            goToPrevUser();
        }
    };

    const goToNextUser = () => {
        if (currentUserIndex < usersWithStories.length - 1) {
            setCurrentUserIndex(prev => prev + 1);
            setCurrentStoryIndex(0);
        } else {
            onClose();
        }
    };
    
    const goToPrevUser = () => {
        if (currentUserIndex > 0) {
            setCurrentUserIndex(prev => prev - 1);
            setCurrentStoryIndex(0);
        }
    };

    useEffect(() => {
        if (progressRef.current) {
            progressRef.current.style.transition = 'none';
            progressRef.current.style.width = '0%';
            // Force reflow
            void progressRef.current.offsetWidth;
        }

        if (timerRef.current) clearTimeout(timerRef.current);
        if (isPaused) return;

        const duration = currentStory.type === 'video' ? (videoRef.current?.duration || 15) * 1000 : (currentStory.duration || 5) * 1000;
        
        if (progressRef.current) {
            progressRef.current.style.transition = `width ${duration}ms linear`;
            progressRef.current.style.width = '100%';
        }
        
        timerRef.current = setTimeout(goToNextStory, duration);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [currentStoryIndex, currentUserIndex, isPaused, currentStory]);

    const handleInteractionStart = () => setIsPaused(true);
    const handleInteractionEnd = () => setIsPaused(false);

    return (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            <div className="relative w-full max-w-sm h-full max-h-[90vh] bg-gray-900 rounded-lg overflow-hidden" onMouseDown={handleInteractionStart} onMouseUp={handleInteractionEnd} onTouchStart={handleInteractionStart} onTouchEnd={handleInteractionEnd}>
                
                {/* Story Media */}
                {currentStory.type === 'image' ? (
                    <img src={currentStory.url} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                    <video ref={videoRef} src={currentStory.url} className="w-full h-full object-cover" autoPlay onLoadedData={() => setIsPaused(false)} onPlay={() => setIsPaused(false)} onPause={() => setIsPaused(true)} preload="metadata" />
                )}

                {/* UI Overlay */}
                <div className="absolute inset-0 flex flex-col">
                    {/* Progress Bars */}
                    <div className="flex gap-1 p-2">
                        {currentUser.stories.map((story, index) => (
                            <div key={story.id} className="flex-1 h-1 bg-white/30 rounded-full">
                                <div ref={index === currentStoryIndex ? progressRef : null} className={`h-full rounded-full ${index < currentStoryIndex ? 'bg-white w-full' : index === currentStoryIndex ? 'bg-white' : 'bg-transparent'}`} />
                            </div>
                        ))}
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between p-2">
                        <div className="flex items-center gap-2">
                            <img src={currentUser.avatar} className="w-8 h-8 rounded-full" loading="lazy" />
                            <span className="text-white font-bold text-sm">{currentUser.name}</span>
                        </div>
                        <button onClick={onClose} className="text-white p-1">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Click zones for navigation */}
                    <div className="flex-grow flex">
                        <div className="w-1/3 h-full" onClick={goToPrevStory}></div>
                        <div className="w-2/3 h-full" onClick={goToNextStory}></div>
                    </div>
                </div>
                 {/* User Navigation Arrows */}
                <button onClick={goToPrevUser} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full disabled:opacity-0" disabled={currentUserIndex === 0}>
                    <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <button onClick={goToNextUser} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full disabled:opacity-0" disabled={currentUserIndex === usersWithStories.length - 1}>
                    <ArrowRightIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default StoryViewer;
