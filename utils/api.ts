import { 
    User, Property, Conversation, SearchTeam, NewPropertyData, Comment, Message, TeamComment, 
    Neighborhood, ScheduledTour, Notification, ServiceProvider 
} from '../types';
import { 
    users as mockUsers, properties as mockProperties, conversations as mockConversations, 
    searchTeams as mockSearchTeams, neighborhoods as mockNeighborhoods, scheduledTours as mockTours,
    notifications as mockNotifications, serviceProviders as mockServiceProviders 
} from '../data/mockData';

const FAKE_LATENCY = 300;

// In a real app, these would be in-memory representations or a more complex state management
let users: User[] = [...mockUsers];
let properties: Property[] = [...mockProperties];
let conversations: Conversation[] = [...mockConversations];
let teams: SearchTeam[] = [...mockSearchTeams];

const fakeFetch = <T>(data: T): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), FAKE_LATENCY));

// --- QUERIES ---

export const fetchUsers = (): Promise<User[]> => fakeFetch(users);
export const fetchProperties = (): Promise<Property[]> => fakeFetch(properties);
export const fetchNeighborhoods = (): Promise<Neighborhood[]> => fakeFetch(mockNeighborhoods);
export const fetchTours = (): Promise<ScheduledTour[]> => fakeFetch(mockTours);
export const fetchNotifications = (): Promise<Notification[]> => fakeFetch(mockNotifications);
export const fetchServiceProviders = (): Promise<ServiceProvider[]> => fakeFetch(mockServiceProviders);
export const fetchConversations = (): Promise<Conversation[]> => fakeFetch(conversations);
export const fetchTeams = (): Promise<SearchTeam[]> => fakeFetch(teams);


// --- MUTATIONS ---

export const toggleLike = async ({ propertyId, userId }: { propertyId: number, userId: number }): Promise<Property> => {
  await new Promise(resolve => setTimeout(resolve, FAKE_LATENCY));
  
  // Simulate potential failure
  if (Math.random() < 0.1) {
    throw new Error("Failed to update like status");
  }

  const propertyIndex = properties.findIndex(p => p.id === propertyId);
  const userIndex = users.findIndex(u => u.id === userId);

  if (propertyIndex === -1 || userIndex === -1) {
    throw new Error("Property or user not found");
  }
  
  const property = properties[propertyIndex];
  const user = users[userIndex];
  
  const isLiked = user.likedPropertyIds?.includes(propertyId) || false;

  if (isLiked) {
    property.likes = Math.max(0, property.likes - 1);
    user.likedPropertyIds = user.likedPropertyIds?.filter(id => id !== propertyId);
  } else {
    property.likes += 1;
    user.likedPropertyIds = [...(user.likedPropertyIds || []), propertyId];
  }
  
  properties[propertyIndex] = { ...property };
  users[userIndex] = { ...user };
  
  return property;
};

export const createPost = async ({ data, currentUser }: { data: NewPropertyData, currentUser: User }): Promise<Property> => {
  await new Promise(resolve => setTimeout(resolve, FAKE_LATENCY));

  const newPost: Property = {
    id: Date.now(),
    lister: currentUser,
    timestamp: new Date().toISOString(),
    images: data.images.map(f => URL.createObjectURL(f)), // In a real app, these would be uploaded URLs
    videos: data.videos.map(f => URL.createObjectURL(f)),
    description: data.description,
    postType: data.postType,
    likes: 0,
    comments: [],
    reposts: 0,
    views: 0,
    isAvailable: true,
    ...(data.postType === 'property' && {
        location: data.location,
        price: data.price,
        priceInterval: data.priceInterval,
        beds: data.beds,
        baths: data.baths,
        type: data.type,
        verificationStatus: 'unverified',
        latitude: data.latitude,
        longitude: data.longitude,
    })
  };
  
  properties = [newPost, ...properties];
  return newPost;
};

export const deletePost = async (propertyId: number): Promise<{ id: number }> => {
  await new Promise(resolve => setTimeout(resolve, FAKE_LATENCY));
  properties = properties.filter(p => p.id !== propertyId);
  return { id: propertyId };
};

export const addComment = async ({ propertyId, text, currentUser }: { propertyId: number, text: string, currentUser: User }): Promise<Comment> => {
    await new Promise(resolve => setTimeout(resolve, FAKE_LATENCY));
    const propertyIndex = properties.findIndex(p => p.id === propertyId);
    if (propertyIndex === -1) throw new Error("Property not found");

    const newComment: Comment = {
        id: Date.now(),
        user: currentUser,
        text,
        timestamp: new Date().toISOString(),
    };

    properties[propertyIndex].comments.push(newComment);
    return newComment;
};

export const sendMessage = async ({ conversationId, text, userId }: { conversationId: number, text: string, userId: number }): Promise<Message> => {
  await new Promise(resolve => setTimeout(resolve, FAKE_LATENCY));

  if (Math.random() < 0.1) {
    throw new Error("Failed to send message");
  }

  const conversationIndex = conversations.findIndex(c => c.id === conversationId);
  if (conversationIndex === -1) throw new Error("Conversation not found");

  const newMessage: Message = {
    id: Date.now(),
    senderId: userId,
    text,
    timestamp: new Date().toISOString(),
    read: true,
    type: 'user',
    status: 'sent',
  };

  conversations[conversationIndex].messages.push(newMessage);
  return newMessage;
};

export const createTeam = async ({ name, memberIds, creator }: { name: string, memberIds: number[], creator: User }): Promise<{ newTeam: SearchTeam, newConversation: Conversation }> => {
    await new Promise(resolve => setTimeout(resolve, FAKE_LATENCY));
    
    const members = [creator, ...memberIds.map(id => users.find(u => u.id === id)).filter((u): u is User => !!u)];

    const newConversation: Conversation = {
        id: Date.now(),
        participants: members,
        messages: [{
            id: Date.now() + 1,
            senderId: 0,
            text: `${creator.name} created the team.`,
            timestamp: new Date().toISOString(),
            read: true,
            type: 'system'
        }],
    };

    const newTeam: SearchTeam = {
        id: Date.now() + 2,
        name,
        memberIds: [creator.id, ...memberIds],
        conversationId: newConversation.id,
        sharedProperties: [],
    };
    
    newConversation.teamId = newTeam.id;

    teams = [...teams, newTeam];
    conversations = [...conversations, newConversation];
    
    return { newTeam, newConversation };
};

export const addTeamComment = async ({ teamId, propertyId, text, author }: { teamId: number, propertyId: number, text: string, author: User }): Promise<TeamComment> => {
    await new Promise(resolve => setTimeout(resolve, FAKE_LATENCY));
    
    const teamIndex = teams.findIndex(t => t.id === teamId);
    if (teamIndex === -1) throw new Error("Team not found");

    const newComment: TeamComment = {
        id: Date.now(),
        author,
        text,
        timestamp: new Date().toISOString(),
    };

    const team = teams[teamIndex];
    const sharedPropIndex = team.sharedProperties.findIndex(sp => sp.propertyId === propertyId);
    if (sharedPropIndex !== -1) {
        team.sharedProperties[sharedPropIndex].comments.push(newComment);
    }
    
    return newComment;
};

export const toggleFollow = async ({ userIdToFollow, currentUserId }: { userIdToFollow: number, currentUserId: number }): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, FAKE_LATENCY));
    
    const currentUserIndex = users.findIndex(u => u.id === currentUserId);
    const userToFollowIndex = users.findIndex(u => u.id === userIdToFollow);

    if (currentUserIndex === -1 || userToFollowIndex === -1) {
        throw new Error("User not found");
    }

    const currentUser = users[currentUserIndex];
    const userToFollow = users[userToFollowIndex];

    const isFollowing = currentUser.followingIds.includes(userIdToFollow);

    if (isFollowing) {
        currentUser.followingIds = currentUser.followingIds.filter(id => id !== userIdToFollow);
        currentUser.followingCount = Math.max(0, currentUser.followingCount - 1);
        userToFollow.followerIds = userToFollow.followerIds.filter(id => id !== currentUserId);
        userToFollow.followersCount = Math.max(0, userToFollow.followersCount - 1);
    } else {
        currentUser.followingIds.push(userIdToFollow);
        currentUser.followingCount += 1;
        userToFollow.followerIds.push(currentUserId);
        userToFollow.followersCount += 1;
    }
    
    return currentUser;
};

export const updateProfile = async ({ userId, updates }: { userId: number, updates: Partial<User> }): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, FAKE_LATENCY));
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error("User not found");
    
    users[userIndex] = { ...users[userIndex], ...updates };
    return users[userIndex];
};
