import React, { useMemo } from 'react';
// FIX: Changed to named import for FixedSizeList, resolving module export error.
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import PropertyPost from '../components/property/PropertyPost';
import PropertyPostSkeleton from '../components/skeletons/PropertyPostSkeleton';
import PostComposer from '../components/post/PostComposer';
import StoryTray from '../components/stories/StoryTray';
import { useUserStore, useUIStore } from '../store';
import { useGetProperties, useGetUsers, useCreatePost } from '../hooks/useData';
// FIX: Changed import for NewPropertyData to come from the central types file.
import type { NewPropertyData } from '../types';

const HomeScreen: React.FC = () => {
  const { data: allProperties, isLoading: isLoadingProperties } = useGetProperties();
  const { data: users, isLoading: isLoadingUsers } = useGetUsers();
  const { currentUserId } = useUserStore();
  const { openModal, showNotification } = useUIStore();
  const createPostMutation = useCreatePost();

  const currentUser = useMemo(() => users?.find(u => u.id === currentUserId), [users, currentUserId]);

  const properties = useMemo(() => {
    if (!currentUser || !allProperties) return [];
    const followingIds = new Set(currentUser.followingIds);
    return allProperties.filter(p => followingIds.has(p.lister.id));
  }, [allProperties, currentUser]);
  
  const usersWithStories = useMemo(() => users?.filter(u => u.stories && u.stories.length > 0) || [], [users]);

  const handleCreatePost = async (data: NewPropertyData) => {
    await createPostMutation.mutateAsync(data);
    showNotification({ type: 'success', message: 'Post created successfully!' });
  };

  const handleAddStory = (file: File) => {
    showNotification({ type: 'info', message: `Story "${file.name}" added! (feature in progress)` });
  };

  const Row = ({ index, style }: { index: number, style: React.CSSProperties }) => (
    <div style={style}>
      <PropertyPost property={properties[index]} />
    </div>
  );
  
  if (isLoadingUsers || !currentUser) {
    return <div className="p-4"><PropertyPostSkeleton /></div>; // Show a loader while the current user is loading
  }

  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-full max-w-2xl bg-white flex flex-col h-full">
        <header className="flex-shrink-0">
          <div className="border-b border-gray-200">
            <StoryTray 
              currentUser={currentUser}
              usersWithStories={usersWithStories}
              onAddStory={handleAddStory}
              onViewStory={(user) => openModal('story', { storyUser: user })}
            />
          </div>
          <PostComposer 
            currentUser={currentUser}
            onCreatePost={handleCreatePost}
            onAddStory={handleAddStory}
          />
        </header>

        <main className="flex-grow divide-y divide-gray-100">
          {isLoadingProperties ? (
            Array.from({ length: 3 }).map((_, index) => <PropertyPostSkeleton key={index} />)
          ) : properties.length > 0 ? (
            <AutoSizer>
              {({ height, width }) => (
                <FixedSizeList
                  height={height}
                  itemCount={properties.length}
                  itemSize={850} // Estimated height for a PropertyPost
                  width={width}
                >
                  {Row}
                </FixedSizeList>
              )}
            </AutoSizer>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <h2 className="text-xl font-semibold">Welcome to your Feed!</h2>
              <p className="mt-2">Follow users to see their posts here. Use the search tab to discover new properties and people.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomeScreen;