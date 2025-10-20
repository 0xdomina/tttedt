import React, { useState, useEffect, useRef } from 'react';
import { Property } from '../../types';
import { HeartIcon, MessageCircleIcon, ShareIcon } from '../Icons';
import { useUserStore, useUIStore } from '../../store';
import { useGetUsers, useToggleLike } from '../../hooks/useData';

interface DiscoverPostProps {
  property: Property;
  isActive: boolean;
}

const DiscoverPost: React.FC<DiscoverPostProps> = ({ property, isActive }) => {
  const { currentUserId } = useUserStore();
  const { data: users } = useGetUsers();
  const currentUser = users?.find(u => u.id === currentUserId);
  const toggleLikeMutation = useToggleLike();
  const { openModal } = useUIStore();
  const mediaUrl = property.videos?.[0] || property.images[0];
  const isVideo = !!property.videos?.[0];
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const isLiked = currentUser?.likedPropertyIds?.includes(property.id) || false;
  
  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(error => {
          console.log('Video autoplay prevented, trying with mute:', error);
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play();
          }
        });
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0; // Rewind when not active
      }
    }
  }, [isActive]);

  const handleShare = async () => {
    const shareUrl = `https://edqorta.app/property/${property.id}`;
    const shareData = {
      title: `Check out this property on edQorta`,
      text: `${property.description?.substring(0, 100)}... at ${property.location}`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error("Share failed:", err);
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert('Sharing not available. Link copied to clipboard!');
      } catch (clipboardErr) {
        console.error("Clipboard write failed:", clipboardErr);
        alert('Sharing and copying failed. Please copy the link manually.');
      }
    }
  };

  if (!currentUser) {
    return null; // or a loading state
  }

  return (
    <div className="relative h-full w-full bg-black">
      {isVideo ? (
        <video ref={videoRef} src={mediaUrl} loop autoPlay muted playsInline preload="metadata" className="h-full w-full object-cover" />
      ) : (
        <img src={mediaUrl} alt="property" className="h-full w-full object-cover" loading="lazy" />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
      
      {/* UI Overlay */}
      <div className="absolute inset-0 p-4 text-white flex flex-col justify-end">
      
        {/* Action Buttons (Right side) */}
        <div className="absolute right-4 bottom-20 md:bottom-4 flex flex-col items-center gap-6">
          <button onClick={() => toggleLikeMutation.mutate(property.id)} className="flex flex-col items-center text-center">
            <div className={`p-3 rounded-full transition-colors bg-black/30 backdrop-blur-sm ${isLiked ? 'bg-red-500/60' : ''}`}>
              <HeartIcon className="w-7 h-7" isLiked={isLiked} />
            </div>
            <span className="text-sm font-semibold mt-1.5 drop-shadow-lg">{property.likes.toLocaleString()}</span>
          </button>
          <button onClick={() => openModal('comments', { property })} className="flex flex-col items-center text-center">
            <div className="bg-black/30 backdrop-blur-sm p-3 rounded-full"><MessageCircleIcon className="w-7 h-7" /></div>
            <span className="text-sm font-semibold mt-1.5 drop-shadow-lg">{property.comments.length.toLocaleString()}</span>
          </button>
          <button onClick={handleShare} className="flex flex-col items-center text-center">
            <div className="bg-black/30 backdrop-blur-sm p-3 rounded-full"><ShareIcon className="w-7 h-7" /></div>
            <span className="text-sm font-semibold mt-1.5 drop-shadow-lg">Share</span>
          </button>
        </div>

        {/* Content (Left side) */}
        <div className="pb-16 md:pb-0 pr-16"> {/* Padding to avoid nav bar and action buttons */}
          <div className="flex items-center gap-3">
            <img src={property.lister.avatar} alt={property.lister.name} className="w-12 h-12 rounded-full border-2 border-white" loading="lazy" />
            <div>
              <p className="font-bold text-lg drop-shadow-lg">{property.lister.name}</p>
              <p className="text-sm drop-shadow-lg">@{property.lister.username}</p>
            </div>
          </div>
          <p className="mt-3 text-sm line-clamp-3 drop-shadow-lg">{property.description}</p>
          {property.postType === 'property' && (
            <div className="font-bold mt-2 text-lg drop-shadow-lg">₦{property.price?.toLocaleString()} - <span className="font-medium text-base">{property.location}</span></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoverPost;
