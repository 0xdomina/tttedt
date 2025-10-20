export interface Story {
  id: number;
  type: 'image' | 'video';
  url: string;
  timestamp: string;
  duration?: number;
}

export interface Review {
  id: number;
  reviewer: UserSummary;
  rating: number;
  text: string;
  timestamp: string;
}

export interface UserSummary {
    id: number;
    name: string;
    username: string;
    avatar: string;
    agentStatus: 'verified' | 'pending' | 'none';
    listerStatus: 'verified' | 'unverified';
}

export interface User {
  id: number;
  name: string;
  username: string;
  avatar: string;
  bannerImage: string;
  accountType: 'personal' | 'business';
  businessType?: 'agency' | 'shortlet' | 'hotel';
  businessStatus?: 'verified' | 'unverified';
  agentStatus: 'verified' | 'pending' | 'none';
  listerStatus: 'verified' | 'unverified';
  bio: string;
  location: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  followerIds: number[];
  followingIds: number[];
  referralCode?: string;
  referralStats?: { clicks: number; signups: number; earnings: number };
  ratings?: string;
  trustScore: number;
  feedbacksCount?: number;
  likedPropertyIds?: number[];
  reviews: Review[];
  stories: Story[];
  activeInNeighborhoods?: number[];
  isPrivate?: boolean;
}

export interface Comment {
  id: number;
  user: User;
  text: string;
  timestamp: string;
}

export interface Property {
  id: number;
  lister: User;
  postType: 'property' | 'normal';
  timestamp: string;
  description: string;
  images: string[];
  videos?: string[];
  likes: number;
  views?: number;
  comments: Comment[];
  reposts: number;
  location?: string;
  price?: number;
  priceInterval?: 'year' | 'month' | 'week' | 'day' | 'night';
  beds?: number;
  baths?: number;
  type?: 'rent' | 'sale';
  verificationStatus?: 'verified' | 'pending' | 'unverified';
  verifier?: User;
  latitude?: number;
  longitude?: number;
  verificationFee?: number;
  verificationAssignedAt?: string;
  verificationCompletedAt?: string;
  neighborhoodId?: number;
  isAvailable?: boolean;
  businessType?: 'agency' | 'shortlet' | 'hotel';
}

export interface Message {
  id: number;
  senderId: number; // 0 for system
  text?: string;
  audio?: { url: string; duration: number };
  timestamp: string;
  read: boolean;
  type: 'user' | 'system';
  status?: 'sending' | 'sent' | 'failed';
}

export interface Conversation {
  id: number;
  participants: User[];
  messages: Message[];
  propertyId?: number;
  teamId?: number;
  dealStatus?: 'pending' | 'payment_pending' | 'agreement_pending' | 'complete' | 'cancelled';
}

export interface TeamComment {
    id: number;
    author: User;
    text: string;
    timestamp: string;
}

export interface SharedProperty {
    propertyId: number;
    sharerId: number;
    timestamp: string;
    comments: TeamComment[];
}

export interface SearchTeam {
    id: number;
    name: string;
    memberIds: number[];
    conversationId: number;
    sharedProperties: SharedProperty[];
}

export interface NeighborhoodReview {
    id: number;
    author: User;
    ratings: {
        security: number;
        power: number;
        internet: number;
    };
    text: string;
    timestamp: string;
}

export interface Answer {
    id: number;
    text: string;
    author: User;
    timestamp: string;
}

export interface Question {
    id: number;
    text: string;
    author: User;
    timestamp: string;
    upvotes: number;
    answers: Answer[];
}

export interface Neighborhood {
    id: number;
    name: string;
    image: string;
    latitude: number;
    longitude: number;
    questions: Question[];
    reviews: NeighborhoodReview[];
}

export interface ScheduledTour {
    id: number;
    property: Property;
    renter: User;
    agent: User;
    proposedTimes: string[];
    confirmedTime?: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    createdAt: string;
}

export interface Notification {
  id: number;
  type: 'message' | 'verification' | 'deal' | 'follow' | 'like' | 'tour';
  message: string;
  timestamp: string;
  read: boolean;
  relatedId?: number;
  payload?: any;
}

export interface ServiceProvider {
    id: number;
    name: string;
    avatar: string;
    service: string;
    rating: number;
    reviewsCount: number;
    location: string;
}

export interface NewPropertyData {
    images: File[];
    videos: File[];
    description: string;
    postType: 'property' | 'normal';
    location?: string;
    price?: number;
    priceInterval?: 'year' | 'month' | 'week' | 'day' | 'night';
    beds?: number;
    baths?: number;
    type?: 'rent' | 'sale';
    latitude?: number;
    longitude?: number;
}
