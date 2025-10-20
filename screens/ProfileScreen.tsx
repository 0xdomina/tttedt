import React, { useState, useMemo, useEffect, useRef } from 'react';
import PropertyPost from '../components/property/PropertyPost';
import { Review, User, Property } from '../types';
import ReviewItem from '../components/profile/ReviewItem';
import { GiftIcon, PencilIcon, MapPinIcon, CameraIcon, ChatAltIcon, CogIcon, StarIcon, ShieldCheckIcon } from '../components/Icons';
import UserVerifiedBadge from '../components/common/UserVerifiedBadge';
import { useUserStore, useUIStore } from '../store';
import PropertyPostSkeleton from '../components/skeletons/PropertyPostSkeleton';
import { useGetUsers, useGetProperties, useToggleFollow, useUpdateProfile } from '../hooks/useData';

interface ProfileScreenProps {
    profileUserId: number | null;
}

const Stat: React.FC<{ value: string | number; label: string }> = ({ value, label }) => (
  <div className="text-center">
    <p className="font-bold text-lg">{value}</p>
    <p className="text-sm text-gray-500 capitalize">{label}</p>
  </div>
);

const IntegrityRatingBar: React.FC<{ score: number }> = ({ score }) => {
    const percentage = (score / 10) * 100;
    const getColor = (s: number) => {
        if (s <= 2) return 'text-red-500'; if (s <= 4) return 'text-orange-400';
        if (s <= 6) return 'text-yellow-400'; if (s <= 8) return 'text-green-500';
        return 'text-violet-500';
    };
    return (
        <div className="relative w-max" title={`Trust Score: ${score}/10`}>
            <div className="flex -space-x-1.5 text-gray-300">{Array.from({ length: 10 }).map((_, i) => <StarIcon key={i} className="w-5 h-5" />)}</div>
            <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: `${percentage}%` }}><div className={`flex -space-x-1.5 ${getColor(score)}`}>{Array.from({ length: 10 }).map((_, i) => <StarIcon key={i} className="w-5 h-5 flex-shrink-0" filled />)}</div></div>
        </div>
    );
 };


const ProfileScreen: React.FC<ProfileScreenProps> = ({ profileUserId }) => {
  const { currentUserId } = useUserStore();
  const { data: users, isLoading: isLoadingUsers } = useGetUsers();
  const { data: allProperties, isLoading: isLoadingProperties } = useGetProperties();
  const { openFullScreen, openModal, setActiveTab } = useUIStore();
  const toggleFollowMutation = useToggleFollow();
  const updateProfileMutation = useUpdateProfile();

  const currentUser = users?.find(u => u.id === currentUserId);
  const user = users?.find(u => u.id === (profileUserId || currentUserId)) || currentUser;
  
  const [profileTab, setProfileTab] = useState<'posts' | 'liked' | 'reviews'>('posts');
  const [activeReviewTab, setActiveReviewTab] = useState<'received' | 'given'>('received');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedBio, setEditedBio] = useState(user?.bio || '');
  const [editedLocation, setEditedLocation] = useState(user?.location || '');
  
  useEffect(() => { if (user) { setIsEditing(false); setEditedName(user.name); setEditedBio(user.bio || ''); setEditedLocation(user.location || ''); setProfileTab('posts'); } }, [user]);

  const isOwnProfile = user?.id === currentUser?.id;
  const isFollowing = currentUser?.followingIds?.includes(user?.id ?? -1) ?? false;

  const userProperties = useMemo(() => allProperties?.filter(p => p.lister.id === user?.id) || [], [user?.id, allProperties]);
  const likedProperties = useMemo(() => allProperties?.filter(p => user?.likedPropertyIds?.includes(p.id)) || [], [user?.likedPropertyIds, allProperties]);
  const userReviews = useMemo(() => user?.reviews || [], [user?.reviews]);
  
  const reviewsGiven = useMemo(() => {
    if (!users || !user) return [];
    const given: { review: Review; reviewedUser: User }[] = [];
    users.forEach(u => { if (u.reviews && u.id !== user.id) { u.reviews.forEach(review => { if (review.reviewer.id === user.id) { given.push({ review, reviewedUser: u }); } }); } });
    return given;
  }, [user, users]);
  
  const handleSaveChanges = () => {
    if (!user) return;
    const updates: Partial<Pick<User, 'name' | 'bio' | 'location'>> = {};
    if (editedName !== user.name) updates.name = editedName;
    if (editedBio !== (user.bio || '')) updates.bio = editedBio;
    if (editedLocation !== (user.location || '')) updates.location = editedLocation;
    
    if(Object.keys(updates).length > 0) {
      updateProfileMutation.mutate(updates);
    }
    setIsEditing(false);
  };
  
  const handleCancelEdit = () => { if (!user) return; setIsEditing(false); setEditedName(user.name); setEditedBio(user.bio || ''); setEditedLocation(user.location || ''); };

  if (isLoadingUsers || !currentUser || !user) {
    return <PropertyPostSkeleton />;
  }
  
  const renderPosts = (posts: Property[]) => {
      if (isLoadingProperties) return Array.from({ length: 2 }).map((_, i) => <PropertyPostSkeleton key={i} />);
      if (posts.length === 0) {
        if (profileTab === 'posts' && isOwnProfile) {
            return <div className="p-8 text-center"><h3 className="font-semibold text-gray-700">No posts yet</h3><p className="text-gray-500 text-sm mt-1">Your posts will appear here.</p><button onClick={() => setActiveTab('post')} className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700">Create your first post</button></div>;
        }
        if (profileTab === 'liked' && isOwnProfile) {
             return <div className="p-8 text-center"><h3 className="font-semibold text-gray-700">No liked posts</h3><p className="text-gray-500 text-sm mt-1">Posts you like will appear here.</p><button onClick={() => setActiveTab('home')} className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700">Discover posts</button></div>;
        }
        return <p className="p-8 text-center text-gray-500">No posts yet.</p>;
      }
      return posts.map(p => <PropertyPost key={p.id} property={p} />);
  }

  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-full max-w-2xl bg-white md:border-x md:border-gray-200">
        <main>
            <div className="relative h-48 bg-gray-300"><img src={user.bannerImage || '...'} alt={`${user.name}'s banner`} className="w-full h-full object-cover" loading="lazy" /></div>
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-end justify-between -mt-14">
                    <div className="p-1 bg-white rounded-full"><div className="relative w-20 h-20"><img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" loading="lazy" /></div></div>
                    <div className="flex items-center justify-end space-x-2">
                        {isEditing ? (<><button onClick={handleCancelEdit} className="px-4 py-2 text-sm font-semibold bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button><button onClick={handleSaveChanges} className="px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700">Save</button></>)
                        : isOwnProfile ? (<><button onClick={() => openFullScreen('settings')} className="p-2 rounded-full hover:bg-gray-100"><CogIcon className="w-5 h-5 text-gray-500" /></button><button onClick={() => setIsEditing(true)} className="p-2 rounded-full hover:bg-gray-100"><PencilIcon className="w-5 h-5 text-gray-500" /></button></>)
                        : (<div className="flex items-center gap-2 w-full"><button onClick={() => toggleFollowMutation.mutate(user.id)} className={`flex-1 py-2 text-sm font-semibold rounded-lg ${isFollowing ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-violet-600 text-white hover:bg-violet-700'}`}>{isFollowing ? 'Unfollow' : 'Follow'}</button><button onClick={() => { /* Start DM logic is in messaging store */ }} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"><ChatAltIcon className="w-5 h-5 text-gray-700" /></button></div>)}
                    </div>
                </div>
                <div className="mt-4">
                    <div className="flex items-center gap-2"><h2 className="text-xl font-bold text-gray-800 truncate">{user.name}</h2><UserVerifiedBadge user={user} /></div>
                    <div className="flex items-center gap-2 text-md text-gray-500"><span>@{user.username}</span>{user.location && <><span className="text-gray-300">·</span><span className="flex items-center gap-1"><MapPinIcon className="w-4 h-4" /> {user.location}</span></>}</div>
                    <div className="mt-2">
                      <IntegrityRatingBar score={user.trustScore ?? 0} />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{user.bio || 'No bio yet.'}</p>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-y-4 text-center w-full border-t border-gray-100 pt-4">
                    <Stat value={userProperties.length} label="Posts" />
                    <Stat value={user.followersCount ?? 0} label="Followers" />
                    <Stat value={user.followingCount ?? 0} label="Following" />
                    <Stat value={user.trustScore} label="Trust Score" />
                </div>
            </div>
            <div className="border-b border-gray-200"><nav className="flex justify-around"><button onClick={() => setProfileTab('posts')} className={`flex-1 py-3 text-sm font-semibold ${profileTab === 'posts' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500'}`}>Posts</button><button onClick={() => setProfileTab('liked')} className={`flex-1 py-3 text-sm font-semibold ${profileTab === 'liked' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500'}`}>Liked</button><button onClick={() => setProfileTab('reviews')} className={`flex-1 py-3 text-sm font-semibold ${profileTab === 'reviews' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500'}`}>Reviews</button></nav></div>
            <div>{profileTab === 'posts' && <div className="divide-y divide-gray-100">{renderPosts(userProperties)}</div>}{profileTab === 'liked' && <div className="divide-y divide-gray-100">{renderPosts(likedProperties)}</div>}{profileTab === 'reviews' && (<div><div className="flex border-b border-gray-200"><button onClick={() => setActiveReviewTab('received')} className={`flex-1 py-2 text-sm font-semibold ${activeReviewTab === 'received' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500'}`}>Received ({userReviews.length})</button><button onClick={() => setActiveReviewTab('given')} className={`flex-1 py-2 text-sm font-semibold ${activeReviewTab === 'given' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500'}`}>Given ({reviewsGiven.length})</button></div><div className="divide-y divide-gray-100">{activeReviewTab === 'received' && (userReviews.length > 0 ? userReviews.map(r => <ReviewItem key={r.id} review={r} />) : <p className="p-8 text-center text-gray-500">No reviews received yet.</p>)}{activeReviewTab === 'given' && (reviewsGiven.length > 0 ? reviewsGiven.map(item => <ReviewItem key={`${item.review.id}-${item.reviewedUser.id}`} review={item.review} reviewedUser={item.reviewedUser} />) : <p className="p-8 text-center text-gray-500">You haven't reviewed anyone yet.</p>)}</div></div>)}</div>
        </main>
      </div>
    </div>
  );
};

export default ProfileScreen;
