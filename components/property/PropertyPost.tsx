import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Property } from '../../types';
import { HeartIcon, MessageCircleIcon, ShareIcon, ArrowLeftIcon, ArrowRightIcon, MapPinIcon, DotsHorizontalIcon, EyeIcon, ChatAltIcon, PlayIcon } from '../Icons';
import VerificationBadge from '../common/VerificationBadge';
import UserVerifiedBadge from '../common/UserVerifiedBadge';
import PostOptionsMenu from './PostOptionsMenu';
import { useUserStore, useUIStore, useMessagingStore } from '../../store';
import { useGetUsers, useToggleLike, useDeletePost } from '../../hooks/useData';

interface PropertyPostProps {
  property: Property;
}

const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return Math.floor(seconds) + "s";
};

const formatPrice = (price: number, type?: 'rent' | 'sale', interval?: 'year' | 'month' | 'week' | 'day' | 'night') => {
    const priceString = `₦${price.toLocaleString()}`;
    if (type === 'sale') {
      return priceString;
    }
    const intervalString = interval || 'year';
    return `${priceString} / ${intervalString}`;
};

const PropertyPost: React.FC<PropertyPostProps> = ({ property }) => {
  const { lister, price, location, beds, baths, images, videos, verificationStatus, description, type, postType, comments, timestamp } = property;
  
  const { currentUserId } = useUserStore();
  const { data: users } = useGetUsers();
  const { openModal, viewProfile, viewOnMap, setActiveTab } = useUIStore();
  const { startPropertyChat } = useMessagingStore();
  const toggleLikeMutation = useToggleLike();
  const deletePostMutation = useDeletePost();

  const currentUser = useMemo(() => users?.find(u => u.id === currentUserId), [users, currentUserId]);
  const isLiked = useMemo(() => currentUser?.likedPropertyIds?.includes(property.id) || false, [currentUser, property.id]);
  
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const optionsMenuRef = useRef<HTMLDivElement>(null);

  const media = useMemo(() => [
    ...(images || []).map(url => ({ type: 'image' as const, url })),
    ...(videos || []).map(url => ({ type: 'video' as const, url }))
  ], [images, videos]);

  useEffect(() => {
    setCurrentMediaIndex(0);
  }, [property.id]);
  
  const useClickOutside = (ref: React.RefObject<HTMLDivElement>, callback: () => void) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref, callback]);
  };

  useClickOutside(optionsMenuRef, () => setIsOptionsMenuOpen(false));

  const handleLike = () => {
    toggleLikeMutation.mutate(property.id);
  };
  
  const handleDelete = () => {
    deletePostMutation.mutate(property.id);
  };

  const handleMessageLister = () => {
    startPropertyChat(lister, property);
    setActiveTab('messages');
  };
  
  const nextMedia = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentMediaIndex(prev => (prev + 1) % media.length); };
  const prevMedia = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentMediaIndex(prev => (prev - 1 + media.length) % media.length); };
  const goToMedia = (index: number) => { setCurrentMediaIndex(index); };

  if (!currentUser) return null; // or a skeleton

  const canVerify = currentUser.agentStatus === 'verified' && lister.id !== currentUser.id && postType === 'property' && verificationStatus === 'unverified';

  return (
    <article className="bg-white">
      <div className="flex items-center justify-between p-3">
        <button onClick={() => viewProfile(lister.id)} className="flex items-center gap-3 group">
          <img src={lister.avatar} alt={lister.name} className="w-10 h-10 rounded-full" loading="lazy" />
          <div>
            <div className="flex items-center gap-1.5">
                <p className="font-bold text-gray-800 group-hover:underline text-sm">{lister.name}</p>
                <UserVerifiedBadge user={lister} />
            </div>
            {postType === 'property' && <p className="text-xs text-gray-500">{location}</p>}
          </div>
        </button>
        <div className="relative" ref={optionsMenuRef}>
           <button onClick={() => setIsOptionsMenuOpen(prev => !prev)} className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
              <DotsHorizontalIcon className="w-5 h-5" />
           </button>
           {isOptionsMenuOpen && (
              <PostOptionsMenu
                  isOwner={currentUser.id === lister.id}
                  onClose={() => setIsOptionsMenuOpen(false)}
                  onDelete={() => { handleDelete(); setIsOptionsMenuOpen(false); }}
                  onBlockUser={() => openModal('blockUser', { userToBlock: lister })}
                  onReport={() => alert('Post reported!')}
                  onMute={() => alert('User muted!')}
              />
           )}
        </div>
      </div>

      {media.length > 0 && (
        <div className="relative group aspect-square bg-black">
          {media.map((item, index) => (
            <div key={index} className={`w-full h-full absolute transition-opacity duration-300 ${index === currentMediaIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {item.type === 'image' ? <img src={item.url} alt={`Property at ${location}`} className="w-full h-full object-cover" loading="lazy" /> : <video src={item.url} controls preload="metadata" className="w-full h-full object-contain bg-black" />}
            </div>
          ))}
          {media[currentMediaIndex].type === 'video' && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><PlayIcon className="w-16 h-16 text-white/70 drop-shadow-lg" /></div>}
          {media.length > 1 && (
            <>
              <button onClick={prevMedia} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"><ArrowLeftIcon className="w-5 h-5" /></button>
              <button onClick={nextMedia} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"><ArrowRightIcon className="w-5 h-5" /></button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">{media.map((_, index) => <button key={index} onClick={() => goToMedia(index)} className={`w-2 h-2 rounded-full ${index === currentMediaIndex ? 'bg-white' : 'bg-white/50'}`} />)}</div>
            </>
          )}
        </div>
      )}

      <div className="p-3">
          <div className="flex items-center justify-between">
              <div className="flex items-center gap-16">
                 <motion.button 
                    whileTap={{ scale: 0.9, y: 2 }}
                    onClick={handleLike} 
                    className="flex items-center space-x-2 group">
                        <HeartIcon className={`w-7 h-7 transform transition-colors duration-300 ${isLiked ? 'text-red-500' : 'text-gray-800'}`} isLiked={isLiked}/>
                 </motion.button>
                 <button onClick={() => openModal('comments', { property })} className="flex items-center space-x-2 text-gray-800 hover:scale-110"><MessageCircleIcon className="w-7 h-7" /></button>
                 {postType === 'property' && lister.id !== currentUser.id && <button onClick={handleMessageLister} className="flex items-center space-x-2 text-gray-800 hover:scale-110"><ChatAltIcon className="w-7 h-7" /></button>}
                 <button className="flex items-center space-x-2 text-gray-800 hover:scale-110"><ShareIcon className="w-7 h-7" /></button>
              </div>
              {postType === 'property' && <VerificationBadge status={verificationStatus!} onClick={canVerify ? () => openModal('verificationTask', { property }) : undefined} actionText="Verify" />}
          </div>
          
          {property.likes > 0 && <p className="text-sm font-bold mt-2">{property.likes.toLocaleString()} {property.likes === 1 ? 'like' : 'likes'}</p>}
          
          <div className="mt-1 text-sm"><button onClick={() => viewProfile(lister.id)} className="font-bold mr-1">{lister.username}</button> <span>{description}</span></div>

          {postType === 'property' && (
              <div className="mt-2">
                <p className="text-base font-bold text-violet-700">{formatPrice(price!, type, property.priceInterval)}</p>
                <div className="flex items-center space-x-2 text-gray-600 text-xs font-medium mt-1"><span>{beds} {beds === 1 ? 'bed' : 'beds'}</span><span>•</span><span>{baths} {baths === 1 ? 'bath' : 'baths'}</span></div>
              </div>
          )}

          {comments.length > 0 && <button onClick={() => openModal('comments', { property })} className="text-sm text-gray-500 mt-1">View all {comments.length} comments</button>}
          <p className="text-xs text-gray-400 mt-2">{timeAgo(timestamp)}</p>
      </div>
    </article>
  );
};

export default React.memo(PropertyPost);