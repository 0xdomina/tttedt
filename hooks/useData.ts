import { useQuery, useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import * as api from '../utils/api';
import { useUserStore, useUIStore } from '../store';
import { Property, User, Comment, Conversation, Message, SearchTeam, TeamComment } from '../types';
import { NewPropertyData } from '../types';

// --- QUERIES ---

export const useGetUsers = () => useQuery({
  queryKey: ['users'],
  queryFn: api.fetchUsers,
});

export const useGetProperties = () => useQuery({
  queryKey: ['properties'],
  queryFn: api.fetchProperties,
});

export const useGetNeighborhoods = () => useQuery({
  queryKey: ['neighborhoods'],
  queryFn: api.fetchNeighborhoods,
});

export const useGetTours = () => useQuery({
  queryKey: ['tours'],
  queryFn: api.fetchTours,
});

export const useGetNotifications = () => useQuery({
    queryKey: ['notifications'],
    queryFn: api.fetchNotifications,
});

export const useGetServiceProviders = () => useQuery({
    queryKey: ['serviceProviders'],
    queryFn: api.fetchServiceProviders,
});

export const useGetConversations = () => useQuery({
    queryKey: ['conversations'],
    queryFn: api.fetchConversations,
});

export const useGetTeams = () => useQuery({
    queryKey: ['teams'],
    queryFn: api.fetchTeams,
});


// --- MUTATIONS ---

export const useToggleLike = () => {
  const queryClient = useQueryClient();
  const { currentUserId } = useUserStore.getState();
  const { showNotification } = useUIStore.getState();

  return useMutation({
    mutationFn: (propertyId: number) => api.toggleLike({ propertyId, userId: currentUserId }),
    onMutate: async (propertyId: number) => {
      await queryClient.cancelQueries({ queryKey: ['properties'] });
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previousProperties = queryClient.getQueryData<Property[]>(['properties']);
      const previousUsers = queryClient.getQueryData<User[]>(['users']);

      if (previousProperties && previousUsers) {
        const isLiked = previousUsers.find(u => u.id === currentUserId)?.likedPropertyIds?.includes(propertyId);
        queryClient.setQueryData<Property[]>(['properties'], old =>
          old?.map(p => p.id === propertyId ? { ...p, likes: p.likes + (isLiked ? -1 : 1) } : p)
        );
        queryClient.setQueryData<User[]>(['users'], old =>
          old?.map(u => u.id === currentUserId ? { ...u, likedPropertyIds: isLiked ? u.likedPropertyIds?.filter(id => id !== propertyId) : [...(u.likedPropertyIds || []), propertyId] } : u)
        );
      }
      return { previousProperties, previousUsers };
    },
    onError: (err, variables, context) => {
      if (context?.previousProperties) queryClient.setQueryData(['properties'], context.previousProperties);
      if (context?.previousUsers) queryClient.setQueryData(['users'], context.previousUsers);
      showNotification({ type: 'error', message: "Couldn't update like. Please check your connection." });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: NewPropertyData) => {
            const { currentUserId } = useUserStore.getState();
            const users = queryClient.getQueryData<User[]>(['users']);
            const currentUser = users?.find(u => u.id === currentUserId);
            if (!currentUser) throw new Error("User not found");
            return api.createPost({ data, currentUser });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['properties'] });
        },
    });
};

export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deletePost,
        onSuccess: (data) => {
             queryClient.setQueryData<Property[]>(['properties'], old => old?.filter(p => p.id !== data.id));
        }
    });
};

export const useAddComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ propertyId, text }: { propertyId: number; text: string }) => {
            const { currentUserId } = useUserStore.getState();
            const users = queryClient.getQueryData<User[]>(['users']);
            const currentUser = users?.find(u => u.id === currentUserId);
            if (!currentUser) throw new Error("User not found");
            return api.addComment({ propertyId, text, currentUser });
        },
        onSuccess: (newComment, variables) => {
            queryClient.setQueryData<Property[]>(['properties'], old =>
                old?.map(p => p.id === variables.propertyId ? { ...p, comments: [...p.comments, newComment] } : p)
            );
        },
    });
};

export const useSendMessage = () => {
    const queryClient = useQueryClient();
    const { currentUserId } = useUserStore.getState();
    const { showNotification } = useUIStore.getState();

    return useMutation({
        mutationFn: ({ conversationId, text }: { conversationId: number; text: string }) => 
            api.sendMessage({ conversationId, text, userId: currentUserId }),
        onMutate: async ({ conversationId, text }) => {
            await queryClient.cancelQueries({ queryKey: ['conversations'] });
            const previousConversations = queryClient.getQueryData<Conversation[]>(['conversations']);
            const optimisticMessage: Message = {
                id: Date.now(),
                senderId: currentUserId,
                text,
                timestamp: new Date().toISOString(),
                read: true,
                type: 'user',
                status: 'sending',
            };

            queryClient.setQueryData<Conversation[]>(['conversations'], old => 
                old?.map(c => c.id === conversationId ? { ...c, messages: [...c.messages, optimisticMessage] } : c)
            );
            
            return { previousConversations, optimisticMessageId: optimisticMessage.id };
        },
        onSuccess: (data, variables, context) => {
            queryClient.setQueryData<Conversation[]>(['conversations'], old => 
                old?.map(c => c.id === variables.conversationId ? { ...c, messages: c.messages.map(m => m.id === context?.optimisticMessageId ? data : m) } : c)
            );
        },
        onError: (err, variables, context) => {
            showNotification({ type: 'error', message: "Failed to send message." });
            queryClient.setQueryData<Conversation[]>(['conversations'], old => 
                old?.map(c => c.id === variables.conversationId ? { ...c, messages: c.messages.map(m => m.id === context?.optimisticMessageId ? { ...m, status: 'failed' } : m) } : c)
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
    });
};

export const useCreateTeam = (options?: UseMutationOptions<any, Error, { name: string; memberIds: number[] }>) => {
    const queryClient = useQueryClient();
    const { currentUserId } = useUserStore.getState();

    return useMutation({
        mutationFn: ({ name, memberIds }: { name: string; memberIds: number[] }) => {
            const users = queryClient.getQueryData<User[]>(['users']);
            const creator = users?.find(u => u.id === currentUserId);
            if (!creator) throw new Error("Current user not found");
            return api.createTeam({ name, memberIds, creator });
        },
        onSuccess: ({ newTeam, newConversation }) => {
            queryClient.setQueryData<SearchTeam[]>(['teams'], old => [...(old || []), newTeam]);
            queryClient.setQueryData<Conversation[]>(['conversations'], old => [...(old || []), newConversation]);
            queryClient.invalidateQueries({ queryKey: ['teams'] });
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
        ...options
    });
};

export const useAddTeamComment = () => {
    const queryClient = useQueryClient();
    const { currentUserId } = useUserStore.getState();

    return useMutation({
        mutationFn: ({ teamId, propertyId, text }: { teamId: number; propertyId: number; text: string; }) => {
            const users = queryClient.getQueryData<User[]>(['users']);
            const author = users?.find(u => u.id === currentUserId);
            if (!author) throw new Error("Author not found");
            return api.addTeamComment({ teamId, propertyId, text, author });
        },
        onSuccess: (newComment, variables) => {
            queryClient.setQueryData<SearchTeam[]>(['teams'], old => {
                return old?.map(team => {
                    if (team.id === variables.teamId) {
                        const newSharedProps = team.sharedProperties.map(sp => {
                            if (sp.propertyId === variables.propertyId) {
                                return { ...sp, comments: [...sp.comments, newComment] };
                            }
                            return sp;
                        });
                        return { ...team, sharedProperties: newSharedProps };
                    }
                    return team;
                });
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['teams'] });
        }
    });
};

export const useToggleFollow = () => {
    const queryClient = useQueryClient();
    const { currentUserId } = useUserStore.getState();
    
    return useMutation({
        mutationFn: (userIdToFollow: number) => api.toggleFollow({ userIdToFollow, currentUserId }),
        onMutate: async (userIdToFollow: number) => {
            await queryClient.cancelQueries({ queryKey: ['users'] });
            const previousUsers = queryClient.getQueryData<User[]>(['users']);

            queryClient.setQueryData<User[]>(['users'], old => {
                if (!old) return [];
                const isFollowing = old.find(u => u.id === currentUserId)?.followingIds.includes(userIdToFollow);
                return old.map(u => {
                    if (u.id === currentUserId) {
                        const newFollowingIds = isFollowing ? u.followingIds.filter(id => id !== userIdToFollow) : [...u.followingIds, userIdToFollow];
                        return { ...u, followingIds: newFollowingIds, followingCount: newFollowingIds.length };
                    }
                    if (u.id === userIdToFollow) {
                        const newFollowerIds = isFollowing ? u.followerIds.filter(id => id !== currentUserId) : [...u.followerIds, currentUserId];
                        return { ...u, followerIds: newFollowerIds, followersCount: newFollowerIds.length };
                    }
                    return u;
                });
            });
            return { previousUsers };
        },
        onError: (err, variables, context) => {
            if (context?.previousUsers) queryClient.setQueryData(['users'], context.previousUsers);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const { currentUserId } = useUserStore.getState();
    const { showNotification } = useUIStore.getState();

    return useMutation({
        mutationFn: (updates: Partial<User>) => api.updateProfile({ userId: currentUserId, updates }),
        onSuccess: (updatedUser) => {
            queryClient.setQueryData<User[]>(['users'], old => old?.map(u => u.id === updatedUser.id ? updatedUser : u));
            showNotification({ type: 'success', message: 'Profile updated successfully!' });
        },
        onError: () => {
            showNotification({ type: 'error', message: 'Failed to update profile.' });
        }
    });
};
