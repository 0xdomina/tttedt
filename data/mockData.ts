// Fix: Changed import to `import type` to correctly import types from the fixed `types.ts` and resolve circular dependencies.
import type { User, Property, Conversation, Comment, Review, Neighborhood, SearchTeam, NeighborhoodReview, ScheduledTour, Notification, ServiceProvider } from '../types';

const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString();
const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();


export const users: User[] = [
  { 
    id: 1, 
    name: 'Amaka', 
    username: 'amaka_dev',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg', 
    bannerImage: 'https://images.unsplash.com/photo-1560518883-ce09059ee41F?w=1200&auto=format&fit=crop',
    accountType: 'personal',
    agentStatus: 'verified', 
    listerStatus: 'unverified',
    bio: 'Software developer turned edQorta Agent. Helping you find your next home, hassle-free.', 
    location: 'Lagos, Nigeria',
    postsCount: 3, 
    followersCount: 3, 
    followingCount: 9,
    followerIds: [2, 6, 7],
    followingIds: [2, 3, 4, 8, 11, 12, 13, 14, 15],
    referralCode: 'AMAKA-REF-123',
    referralStats: { clicks: 120, signups: 15, earnings: 7500 },
    ratings: "4.5", 
    trustScore: 7.5,
    feedbacksCount: 1, 
    likedPropertyIds: [2, 7, 11],
    reviews: [
      { id: 1, reviewer: { id: 3, name: 'Mrs. Adebayo', username: 'adebayo_props', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', agentStatus: 'none', listerStatus: 'verified' }, rating: 5, text: "Amaka was a wonderful and respectful tenant. Paid her rent on time and kept the apartment in great condition. Highly recommended!", timestamp: "2023-12-15T14:00:00Z" }
    ],
    stories: [
      { id: 101, type: 'image', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', timestamp: oneHourAgo, duration: 5 },
      { id: 102, type: 'image', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', timestamp: twoHoursAgo, duration: 5 },
    ],
    activeInNeighborhoods: [1, 2],
  },
  { 
    id: 2, 
    name: 'David', 
    username: 'david_agent',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg', 
    bannerImage: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200&auto=format&fit=crop',
    accountType: 'personal',
    agentStatus: 'verified', 
    listerStatus: 'unverified',
    bio: 'Your friendly neighborhood edQorta agent! Helping you find your next home, hassle-free.', 
    location: 'Abuja, Nigeria',
    postsCount: 5, 
    followersCount: 2, 
    followingCount: 3,
    followerIds: [1, 7],
    followingIds: [1, 4, 8],
    referralCode: 'DAVID25', 
    referralStats: { clicks: 250, signups: 25, earnings: 18000 },
    ratings: "4.9", 
    trustScore: 8.8,
    feedbacksCount: 2, 
    likedPropertyIds: [1, 3, 5, 10],
    reviews: [
      { id: 2, reviewer: { id: 1, name: 'Amaka', username: 'amaka_dev', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', agentStatus: 'none', listerStatus: 'unverified' }, rating: 5, text: "David was incredibly helpful during my apartment search. He's professional, knowledgeable, and made the verification process seamless. A true 5-star agent!", timestamp: "2024-06-20T11:30:00Z" },
      { id: 3, reviewer: { id: 3, name: 'Mrs. Adebayo', username: 'adebayo_props', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', agentStatus: 'none', listerStatus: 'verified' }, rating: 4, text: "Very efficient in verifying my property listing. The process was quick.", timestamp: "2024-05-10T18:00:00Z" }
    ],
    activeInNeighborhoods: [1, 2],
    stories: [
      { id: 201, type: 'video', url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4', timestamp: threeHoursAgo },
      { id: 202, type: 'image', url: 'https://images.unsplash.com/photo-1613490493576-75de62add859?w=800', timestamp: fourHoursAgo, duration: 5 },
    ]
  },
  { 
    id: 3, 
    name: 'Mrs. Adebayo', 
    username: 'adebayo_props',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg', 
    bannerImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop',
    accountType: 'personal',
    agentStatus: 'none', 
    listerStatus: 'verified', 
    bio: 'Landlord. I list my properties here to find reliable tenants quickly.', 
    location: 'Lagos, Nigeria',
    postsCount: 3, 
    followersCount: 1, 
    followingCount: 1,
    followerIds: [1],
    followingIds: [6],
    ratings: "4.7", 
    trustScore: 8.2,
    feedbacksCount: 0, 
    likedPropertyIds: [9],
    reviews: [],
    stories: [] 
  },
  { 
    id: 4, 
    name: 'Chioma', 
    username: 'chioma_luxe',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg', 
    bannerImage: 'https://images.unsplash.com/photo-1613490493576-75de62add859?w=1200&auto=format&fit=crop',
    accountType: 'personal',
    agentStatus: 'verified', 
    listerStatus: 'unverified', 
    bio: 'Verified edQorta Agent. Specializing in luxury properties in Ikoyi and VI.', 
    location: 'Lagos, Nigeria',
    postsCount: 10, 
    followersCount: 2, 
    followingCount: 2,
    followerIds: [2, 8],
    followingIds: [8, 9],
    referralCode: 'CHIOMA10', 
    referralStats: { clicks: 500, signups: 40, earnings: 32000 },
    ratings: "5.0", 
    trustScore: 6.5,
    feedbacksCount: 0, 
    likedPropertyIds: [3, 7, 12, 14],
    reviews: [],
    activeInNeighborhoods: [1, 3],
    stories: [
        { id: 401, type: 'image', url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', timestamp: oneHourAgo, duration: 5 }
    ]
  },
  { 
    id: 5, 
    name: 'John Doe', 
    username: 'johndoe',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg', 
    bannerImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop',
    accountType: 'personal',
    agentStatus: 'pending', 
    listerStatus: 'unverified', 
    bio: 'Just moved to Lagos, exploring the real estate scene. My agent application is pending!', 
    location: 'Lagos, Nigeria',
    postsCount: 0, 
    followersCount: 1, 
    followingCount: 1,
    followerIds: [7],
    followingIds: [7],
    referralCode: 'JOHN-D-789',
    referralStats: { clicks: 10, signups: 1, earnings: 0 },
    trustScore: 5.0,
    likedPropertyIds: [1],
    reviews: [],
    stories: [],
  },
  {
    id: 6,
    name: 'Tunde',
    username: 'tunde_builds',
    avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
    bannerImage: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&auto=format&fit=crop',
    accountType: 'personal',
    agentStatus: 'none',
    listerStatus: 'verified',
    bio: 'Real estate developer and landlord. Quality homes for discerning clients.',
    location: 'Lagos, Nigeria',
    postsCount: 8,
    followersCount: 2,
    followingCount: 1,
    followerIds: [1, 3],
    followingIds: [8],
    trustScore: 7.0,
    likedPropertyIds: [1, 2, 3, 4],
    reviews: [],
    stories: []
  },
  {
    id: 7,
    name: 'Fatima',
    username: 'fatima_finds',
    avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
    bannerImage: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&auto=format&fit=crop',
    accountType: 'personal',
    agentStatus: 'none',
    listerStatus: 'unverified',
    bio: 'Searching for the perfect apartment in Lagos. Documenting my journey!',
    location: 'Lagos, Nigeria',
    postsCount: 1,
    followersCount: 2,
    followingCount: 3,
    followerIds: [5, 9],
    followingIds: [1, 2, 5],
    referralCode: 'FATIMA-GO',
    referralStats: { clicks: 5, signups: 0, earnings: 0 },
    trustScore: 4.5,
    likedPropertyIds: [13, 15],
    reviews: [],
    stories: [
      { id: 701, type: 'image', url: 'https://images.unsplash.com/photo-1556912173-35f25c754418?w=800', timestamp: thirtyMinutesAgo, duration: 5 }
    ]
  },
  {
    id: 8,
    name: 'Emeka',
    username: 'emeka_ikoyi_agent',
    avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
    bannerImage: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&auto=format&fit=crop',
    accountType: 'personal',
    agentStatus: 'verified',
    listerStatus: 'unverified',
    bio: 'Your go-to agent for premium listings in Ikoyi. Let me help you find luxury.',
    location: 'Lagos, Nigeria',
    postsCount: 12,
    followersCount: 3,
    followingCount: 2,
    followerIds: [1, 4, 6],
    followingIds: [2, 4],
    referralCode: 'EMEKA5',
    referralStats: { clicks: 80, signups: 10, earnings: 5000 },
    ratings: "4.8",
    trustScore: 6.8,
    feedbacksCount: 0,
    likedPropertyIds: [3, 12, 14],
    reviews: [],
    activeInNeighborhoods: [3],
    stories: []
  },
  {
    id: 9,
    name: 'Funke',
    username: 'funke_lifestyle',
    avatar: 'https://randomuser.me/api/portraits/women/9.jpg',
    bannerImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop',
    accountType: 'personal',
    agentStatus: 'none',
    listerStatus: 'unverified',
    bio: 'Lagos living & lifestyle. Sharing beautiful spaces and places.',
    location: 'Lagos, Nigeria',
    postsCount: 2,
    followersCount: 150,
    followingCount: 5,
    followerIds: [], // A lot, not listed
    followingIds: [4, 7],
    trustScore: 5.5,
    likedPropertyIds: [1, 3, 7, 12, 14],
    reviews: [],
    stories: [
       { id: 901, type: 'video', url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4', timestamp: tenMinutesAgo },
       { id: 902, type: 'image', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', timestamp: oneHourAgo, duration: 5 },
    ]
  },
  {
    id: 10,
    name: 'Ahmed',
    username: 'ahmed_new',
    avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
    bannerImage: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&auto=format&fit=crop',
    accountType: 'personal',
    agentStatus: 'none',
    listerStatus: 'unverified',
    bio: '',
    location: '',
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
    followerIds: [],
    followingIds: [],
    trustScore: 2.0,
    reviews: [],
    stories: []
  },
  {
    id: 11,
    name: 'Luxe Shortlets',
    username: 'luxeshortlets',
    avatar: 'https://i.pravatar.cc/150?u=luxe',
    bannerImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&auto=format&fit=crop',
    accountType: 'business',
    businessStatus: 'verified',
    businessType: 'shortlet',
    agentStatus: 'none',
    listerStatus: 'verified',
    bio: 'Premium short-term rentals in Lagos. Experience comfort and luxury.',
    location: 'Lagos, Nigeria',
    postsCount: 1,
    followersCount: 500,
    followingCount: 10,
    followerIds: [],
    followingIds: [],
    trustScore: 9.2,
    reviews: [],
    stories: []
  },
  {
    id: 12,
    name: 'Prestige Realty',
    username: 'prestigerealty',
    avatar: 'https://i.pravatar.cc/150?u=prestige',
    bannerImage: 'https://images.unsplash.com/photo-1560518883-ce09059ee41F?w=1200&auto=format&fit=crop',
    accountType: 'business',
    businessStatus: 'verified',
    businessType: 'agency',
    agentStatus: 'none',
    listerStatus: 'verified',
    bio: 'Your premier destination for luxury real estate in Nigeria. Sales and rentals.',
    location: 'Lagos, Nigeria',
    postsCount: 1,
    followersCount: 1200,
    followingCount: 5,
    followerIds: [],
    followingIds: [],
    trustScore: 9.5,
    reviews: [],
    stories: []
  },
  {
    id: 13,
    name: 'Urban Oasis Hotels',
    username: 'urbanoasis',
    avatar: 'https://i.pravatar.cc/150?u=urban',
    bannerImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop',
    accountType: 'business',
    businessStatus: 'verified',
    businessType: 'hotel',
    agentStatus: 'none',
    listerStatus: 'verified',
    bio: 'Find your sanctuary in the city. Book your stay with Urban Oasis.',
    location: 'Abuja, Nigeria',
    postsCount: 1,
    followersCount: 850,
    followingCount: 2,
    followerIds: [],
    followingIds: [],
    trustScore: 9.1,
    reviews: [],
    stories: []
  },
  {
    id: 14,
    name: 'Cozy Corner Shortlets',
    username: 'cozycorner',
    avatar: 'https://i.pravatar.cc/150?u=cozy',
    bannerImage: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200&auto=format&fit=crop',
    accountType: 'business',
    businessStatus: 'verified',
    businessType: 'shortlet',
    agentStatus: 'none',
    listerStatus: 'verified',
    bio: 'Comfortable and affordable short-term stays. Your home away from home.',
    location: 'Lagos, Nigeria',
    postsCount: 1,
    followersCount: 300,
    followingCount: 8,
    followerIds: [],
    followingIds: [],
    trustScore: 8.9,
    reviews: [],
    stories: []
  },
  {
    id: 15,
    name: 'Prime Properties NG',
    username: 'primepropsng',
    avatar: 'https://i.pravatar.cc/150?u=prime',
    bannerImage: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=1200&auto=format&fit=crop',
    accountType: 'business',
    businessStatus: 'verified',
    businessType: 'agency',
    agentStatus: 'none',
    listerStatus: 'verified',
    bio: 'We deal in prime real estate across Nigeria. Your satisfaction is our priority.',
    location: 'Port Harcourt, Nigeria',
    postsCount: 1,
    followersCount: 2500,
    followingCount: 15,
    followerIds: [],
    followingIds: [],
    trustScore: 9.3,
    reviews: [],
    stories: []
  }
];

export const currentUserId = 1; // Amaka (renter)

const generateComments = (propertyId: number): Comment[] => {
    switch(propertyId) {
        case 1:
            return [
                { id: 101, user: users[0], text: "This looks amazing! Is the generator shared?", timestamp: "2024-07-29T10:00:00Z" },
                { id: 102, user: users[1], text: "Great question Amaka! The generator is for the entire duplex. It's a 24/7 service.", timestamp: "2024-07-29T10:05:00Z" },
                { id: 103, user: users[8], text: "Beautiful finishing. Love the aesthetics.", timestamp: oneDayAgo },
            ];
        case 2:
            return [
                 { id: 201, user: users[4], text: "Is there a service charge for this apartment?", timestamp: "2024-07-29T11:00:00Z" }
            ];
        case 5:
            return [
                { id: 501, user: users[6], text: "This is exactly what I'm looking for. Is it still available?", timestamp: tenMinutesAgo },
                { id: 502, user: users[5], text: "Yes it is. Please book an inspection through the app.", timestamp: fiveMinutesAgo },
            ];
        case 7:
            return [
                { id: 701, user: users[8], text: "Classic Ikoyi property. Well maintained.", timestamp: oneHourAgo },
            ];
        default:
            return [];
    }
}


export const properties: Property[] = [
  {
    id: 1,
    lister: users[2],
    postType: 'property',
    timestamp: oneDayAgo,
    price: 2500000,
    location: 'Lekki Phase 1, Lagos',
    beds: 3,
    baths: 4,
    images: [
      'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=3570&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1613553423758-d8425113ab14?q=80&w=3570&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ],
    verificationStatus: 'verified',
    verifier: users[1],
    description: "A stunning 3-bedroom terrace duplex with all rooms en-suite. Comes with a fully fitted kitchen and a spacious living room. Located in a serene and secured estate.",
    type: 'rent',
    priceInterval: 'year',
    likes: 128,
    views: 12500,
    comments: generateComments(1),
    reposts: 7,
    latitude: 6.4475, 
    longitude: 3.4735,
    verificationFee: 5000,
    verificationAssignedAt: "2024-07-25T10:00:00Z",
    verificationCompletedAt: "2024-07-26T14:30:00Z",
    neighborhoodId: 1,
  },
  {
    id: 2,
    lister: users[0],
    postType: 'property',
    timestamp: fourHoursAgo,
    price: 1800000,
    location: 'Ikeja GRA, Lagos',
    beds: 2,
    baths: 2,
    images: [
        'https://images.unsplash.com/photo-1598228723793-52759bba239c?q=80&w=3474&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ],
    verificationStatus: 'unverified',
    description: "Clean and well-maintained 2-bedroom flat in the heart of Ikeja GRA. Good road network and constant power supply. Perfect for young professionals.",
    type: 'rent',
    priceInterval: 'year',
    likes: 45,
    views: 8900,
    comments: generateComments(2),
    reposts: 2,
    latitude: 6.5969, 
    longitude: 3.3431,
  },
  {
    id: 3,
    lister: users[2],
    postType: 'property',
    timestamp: oneWeekAgo,
    price: 500000000,
    location: 'Banana Island, Lagos',
    beds: 5,
    baths: 6,
    images: [
        'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?q=80&w=3570&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ],
    videos: ['https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_5MB.mp4'],
    verificationStatus: 'verified',
    verifier: users[3],
    description: "Luxury 5-bedroom detached house with a swimming pool and a cinema room. Top-notch finishing and state-of-the-art facilities. Experience unparalleled luxury.",
    type: 'sale',
    likes: 540,
    views: 52300,
    comments: [],
    reposts: 22,
    latitude: 6.4549,
    longitude: 3.4473,
    verificationFee: 15000,
    verificationAssignedAt: "2024-07-20T11:00:00Z",
    verificationCompletedAt: "2024-07-24T10:00:00Z",
    neighborhoodId: 3,
  },
  {
    id: 4,
    lister: users[0],
    postType: 'property',
    timestamp: fiveMinutesAgo,
    price: 850000,
    location: 'Yaba, Lagos',
    beds: 1,
    baths: 1,
    images: [
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=3570&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ],
    verificationStatus: 'pending',
    verifier: users[1],
    description: "A cozy self-contained apartment suitable for students or a single individual. Located close to major institutions and tech hubs in Yaba.",
    type: 'rent',
    priceInterval: 'year',
    likes: 98,
    views: 4200,
    comments: [],
    reposts: 5,
    latitude: 6.5134,
    longitude: 3.3865,
    verificationFee: 3000,
    verificationAssignedAt: "2024-07-29T09:00:00Z",
    neighborhoodId: 2,
  },
  {
    id: 5,
    lister: users[5], // Tunde
    postType: 'property',
    timestamp: twoDaysAgo,
    price: 3200000,
    location: 'Oniru, Lagos',
    images: [ 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800' ],
    verificationStatus: 'verified',
    verifier: users[1], // David
    description: 'Modern 2-bedroom apartment with stunning city views. Features a gym and swimming pool in the complex.',
    type: 'rent',
    priceInterval: 'year',
    likes: 210,
    views: 18000,
    comments: generateComments(5),
    reposts: 15,
    latitude: 6.4296,
    longitude: 3.4451,
    verificationFee: 6000,
    verificationCompletedAt: oneDayAgo,
    neighborhoodId: 1,
  },
  {
    id: 6,
    lister: users[2], // Mrs. Adebayo
    postType: 'property',
    timestamp: twelveHoursAgo,
    price: 1200000,
    location: 'Surulere, Lagos',
    images: [ 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800' ],
    verificationStatus: 'unverified',
    description: 'Spacious 3-bedroom flat in a quiet residential area of Surulere. Recently renovated.',
    type: 'rent',
    priceInterval: 'year',
    likes: 88,
    views: 6500,
    comments: [],
    reposts: 3,
    latitude: 6.4999,
    longitude: 3.3499
  },
  {
    id: 7,
    lister: users[3], // Chioma
    postType: 'property',
    timestamp: threeDaysAgo,
    price: 120000000,
    location: 'Old Ikoyi, Lagos',
    images: [ 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800' ],
    verificationStatus: 'verified',
    verifier: users[7], // Emeka
    description: 'Exquisite 4-bedroom semi-detached duplex. A masterpiece of modern architecture.',
    type: 'sale',
    likes: 450,
    views: 35000,
    comments: generateComments(7),
    reposts: 30,
    latitude: 6.4531,
    longitude: 3.4284,
    verificationFee: 10000,
    verificationCompletedAt: twoDaysAgo,
    neighborhoodId: 3,
  },
  {
    id: 8,
    lister: users[5], // Tunde
    postType: 'property',
    timestamp: sixHoursAgo,
    price: 950000,
    location: 'Iwaya, Yaba',
    images: [ 'https://images.unsplash.com/photo-1605276374104-5de67d60924f?w=800' ],
    videos: ['https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4'],
    verificationStatus: 'pending',
    verifier: users[1], // David
    description: 'Newly built mini-flat perfect for young professionals. Close to the Third Mainland Bridge.',
    type: 'rent',
    priceInterval: 'year',
    likes: 150,
    views: 9800,
    comments: [],
    reposts: 8,
    latitude: 6.5080,
    longitude: 3.3934,
    verificationAssignedAt: fourHoursAgo,
    neighborhoodId: 2
  },
  {
    id: 9,
    lister: users[0], // Amaka
    postType: 'property',
    timestamp: oneWeekAgo,
    price: 2200000,
    location: 'Magodo, Lagos',
    images: [ 'https://images.unsplash.com/photo-1600566753190-17f0e272aa65?w=800' ],
    verificationStatus: 'unverified',
    description: 'Lovely 2-bedroom apartment in a secure estate in Magodo Phase 2.',
    type: 'rent',
    priceInterval: 'year',
    likes: 75,
    views: 5500,
    comments: [],
    reposts: 1,
    latitude: 6.6432,
    longitude: 3.3892
  },
  {
    id: 10,
    lister: users[5], // Tunde
    postType: 'property',
    timestamp: twoWeeksAgo,
    price: 85000000,
    location: 'Chevron, Lekki',
    images: [ 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800' ],
    verificationStatus: 'verified',
    verifier: users[3], // Chioma
    description: 'Well-finished 4-bedroom terrace duplex for sale. Great for families.',
    type: 'sale',
    likes: 320,
    views: 28000,
    comments: [],
    reposts: 18,
    latitude: 6.4429,
    longitude: 3.5381,
    neighborhoodId: 1
  },
  {
    id: 11,
    lister: users[7], // Emeka
    postType: 'property',
    timestamp: oneDayAgo,
    price: 15000000,
    location: 'Dolphin Estate, Ikoyi',
    images: [ 'https://images.unsplash.com/photo-1513584684374-8BAB748fbf90?w=800' ],
    verificationStatus: 'verified',
    verifier: users[3], // Chioma
    description: 'Tastefully finished 3-bedroom flat with excellent facilities. Annual rent.',
    type: 'rent',
    priceInterval: 'year',
    likes: 180,
    views: 15000,
    comments: [],
    reposts: 9,
    latitude: 6.4623,
    longitude: 3.4243,
    neighborhoodId: 3,
  },
  {
    id: 12,
    lister: users[3], // Chioma
    postType: 'normal',
    timestamp: twoHoursAgo,
    description: "Just closed a deal on a fantastic property in Ikoyi! The market is buzzing. If you're looking for luxury, now is the time to invest. #RealEstate #LagosLuxury #Ikoyi",
    images: ['https://images.unsplash.com/photo-1560185007-c5ca9157a492?w=800'],
    likes: 95,
    comments: [],
    reposts: 12,
    location: undefined,
    verificationStatus: undefined
  },
  {
    id: 13,
    lister: users[6], // Fatima
    postType: 'normal',
    timestamp: oneHourAgo,
    description: "Apartment hunting is a full-time job! Saw a lovely place in Yaba today but the agent was a bit sketchy. The search continues! #LagosLiving #ApartmentHunt",
    images: [],
    likes: 42,
    comments: [],
    reposts: 4,
    location: undefined,
    verificationStatus: undefined
  },
  {
    id: 14,
    lister: users[7], // Emeka
    postType: 'property',
    timestamp: oneWeekAgo,
    price: 750000000,
    location: 'Bourdillon, Ikoyi',
    images: [ 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800' ],
    verificationStatus: 'pending',
    verifier: users[3], // Chioma
    description: 'Ultra-luxury penthouse apartment with panoramic views of the city. For sale.',
    type: 'sale',
    likes: 600,
    views: 62000,
    comments: [],
    reposts: 45,
    latitude: 6.4495,
    longitude: 3.4245,
    neighborhoodId: 3
  },
  {
    id: 15,
    lister: users[5], // Tunde
    postType: 'property',
    timestamp: thirtyMinutesAgo,
    price: 4500000,
    location: 'Ikate, Lekki',
    images: [ 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800' ],
    verificationStatus: 'unverified',
    description: 'Brand new 3-bedroom apartment available for rent in a serviced estate.',
    type: 'rent',
    priceInterval: 'year',
    likes: 55,
    views: 3200,
    comments: [],
    reposts: 2,
    latitude: 6.4355,
    longitude: 3.5028,
    neighborhoodId: 1
  },
  {
    id: 16,
    lister: users[10], // Luxe Shortlets
    postType: 'property',
    timestamp: twoHoursAgo,
    price: 75000,
    location: 'Victoria Island, Lagos',
    beds: 1,
    baths: 1,
    images: [ 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800' ],
    verificationStatus: 'verified',
    verifier: users[1], // David
    description: 'Experience luxury in our fully serviced 1-bedroom shortlet apartment. 24/7 power, high-speed internet, and premium amenities.',
    type: 'rent',
    priceInterval: 'night',
    likes: 350,
    views: 22000,
    comments: [],
    reposts: 25,
    latitude: 6.4296,
    longitude: 3.4218,
    neighborhoodId: 1
  },
  {
    id: 17,
    lister: users[11], // Prestige Realty
    postType: 'property',
    timestamp: oneDayAgo,
    price: 350000000,
    location: 'Eko Atlantic, Lagos',
    beds: 4,
    baths: 5,
    images: ['https://images.unsplash.com/photo-1612320440318-3a7a2b9a1a43?w=800'],
    verificationStatus: 'verified',
    verifier: users[1], // David
    description: 'Ultra-modern 4-bedroom apartment in Eko Atlantic with breathtaking ocean views. Fully serviced with 24/7 power and security.',
    type: 'sale',
    likes: 890,
    views: 85000,
    comments: [],
    reposts: 50,
    latitude: 6.4032,
    longitude: 3.3934,
    neighborhoodId: 3,
  },
  {
    id: 18,
    lister: users[12], // Urban Oasis Hotels
    postType: 'property',
    timestamp: twelveHoursAgo,
    price: 95000,
    priceInterval: 'night',
    location: 'Wuse II, Abuja',
    beds: 1,
    baths: 1,
    images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'],
    verificationStatus: 'verified',
    verifier: users[1], // David
    description: 'Deluxe King Room at Urban Oasis. Enjoy complimentary breakfast, high-speed WiFi, and access to our rooftop pool.',
    type: 'rent',
    likes: 420,
    views: 33000,
    comments: [],
    reposts: 18,
    latitude: 9.0833,
    longitude: 7.4833,
  },
  {
    id: 19,
    lister: users[13], // Cozy Corner Shortlets
    postType: 'property',
    timestamp: twoDaysAgo,
    price: 250000,
    priceInterval: 'week',
    location: 'GRA Ikeja, Lagos',
    beds: 2,
    baths: 2,
    images: ['https://images.unsplash.com/photo-1594563703937-fdc640497dcd?w=800'],
    verificationStatus: 'verified',
    verifier: users[3], // Chioma
    description: 'Charming 2-bedroom shortlet apartment. Fully furnished with a well-equipped kitchen. Perfect for weekly stays.',
    type: 'rent',
    likes: 180,
    views: 19500,
    comments: [],
    reposts: 9,
    latitude: 6.5969,
    longitude: 3.3431,
    neighborhoodId: 2,
  },
  {
    id: 20,
    lister: users[14], // Prime Properties NG
    postType: 'property',
    timestamp: sixHoursAgo,
    price: 6000000,
    priceInterval: 'year',
    location: 'Old GRA, Port Harcourt',
    beds: 3,
    baths: 3,
    images: ['https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800'],
    verificationStatus: 'verified',
    verifier: users[7], // Emeka
    description: 'Elegant 3-bedroom duplex for rent in a serene and secure neighborhood in Port Harcourt.',
    type: 'rent',
    likes: 310,
    views: 25000,
    comments: [],
    reposts: 11,
    latitude: 4.7774,
    longitude: 7.0134,
  }
];

export const searchTeams: SearchTeam[] = [
    {
        id: 1,
        name: "Lagos Flat Hunt",
        memberIds: [1, 5],
        conversationId: 4,
        sharedProperties: [
            {
                propertyId: 4,
                sharerId: 1,
                timestamp: "2024-07-30T10:00:00Z",
                comments: [
                    { id: 1, author: users[0], text: "This one looks promising for our budget! Close to the tech hubs too.", timestamp: "2024-07-30T10:01:00Z" },
                    { id: 2, author: users[4], text: "Nice find! Let's see if we can book an inspection for this weekend.", timestamp: "2024-07-30T11:20:00Z" },
                ]
            },
            {
                propertyId: 8,
                sharerId: 5,
                timestamp: oneHourAgo,
                comments: []
            }
        ]
    },
    {
        id: 2,
        name: "Ikoyi Luxury Search",
        memberIds: [8, 4, 9],
        conversationId: 6,
        sharedProperties: [
            {
                propertyId: 7,
                sharerId: 8,
                timestamp: twoDaysAgo,
                comments: [
                    { id: 3, author: users[8], text: "Found this gem, what do you guys think?", timestamp: twoDaysAgo },
                    { id: 4, author: users[3], text: "Looks fantastic. A bit pricey but worth it.", timestamp: oneDayAgo }
                ]
            },
            {
                propertyId: 14,
                sharerId: 4,
                timestamp: twelveHoursAgo,
                comments: []
            }
        ]
    }
];

export const conversations: Conversation[] = [
    {
        id: 1,
        participants: [users[0], users[2], users[1]], // Amaka, Mrs. Adebayo, David
        messages: [
            { id: 1, senderId: 1, text: "Hi, I'm interested in your property at Lekki Phase 1, Lagos.", timestamp: "2024-07-28T10:00:00Z", read: true, type: 'user' },
            { id: 2, senderId: 3, text: "Hello Amaka, you're welcome.", timestamp: "2024-07-28T10:02:00Z", read: true, type: 'user' },
            { id: 3, senderId: 0, text: "David (Verified Agent) has joined the conversation to coordinate the tour.", timestamp: "2024-07-28T10:03:00Z", read: true, type: 'system' },
            { id: 4, senderId: 2, text: "Hi Amaka, I'm available to show you the property tomorrow at 12 PM. Does that work?", timestamp: "2024-07-28T10:05:00Z", read: true, type: 'user' },
            { id: 100, senderId: 1, audio: { url: 'https://www.w3schools.com/html/horse.ogg', duration: 4 }, timestamp: "2024-07-28T10:06:00Z", read: true, type: 'user' },
        ],
        propertyId: 1,
        dealStatus: 'payment_pending',
    },
    {
        id: 2,
        participants: [users[0], users[1]], // Amaka & David
        messages: [
            { id: 5, senderId: 2, text: "I've verified the Yaba apartment. It's a great deal.", timestamp: "2024-07-27T15:30:00Z", read: true, type: 'user' },
            { id: 6, senderId: 1, text: "Awesome, thanks for the update David!", timestamp: "2024-07-27T15:32:00Z", read: true, type: 'user' },
        ]
    },
    {
        id: 3,
        participants: [users[0], users[3]], // Amaka & Chioma
        messages: [
            { id: 7, senderId: 4, text: "Hi Amaka, following up on your interest for the Banana Island property. Let me know if you have questions.", timestamp: oneDayAgo, read: false, type: 'user' }
        ]
    },
    {
        id: 4,
        participants: [users[0], users[4]], // Amaka, John Doe
        messages: [
            { id: 8, senderId: 1, text: "Hey John, I've created this team chat for our apartment search!", timestamp: "2024-07-30T09:55:00Z", read: true, type: 'user' },
            { id: 9, senderId: 1, text: "I just shared a property to our list. Check it out in the 'Shared Properties' tab.", timestamp: "2024-07-30T10:00:30Z", read: true, type: 'user' },
        ],
        teamId: 1,
    },
    {
        id: 5,
        participants: [users[6], users[5]], // Fatima, Tunde
        messages: [
            { id: 10, senderId: 7, text: "Hello Tunde, I love your property in Oniru. Is the price negotiable?", timestamp: tenMinutesAgo, read: false, type: 'user' }
        ],
        propertyId: 5
    },
    {
        id: 6,
        participants: [users[7], users[3], users[8]], // Emeka, Chioma, Funke
        messages: [
            { id: 11, senderId: 8, text: "Hey team, welcome to the Ikoyi luxury hunt!", timestamp: twoDaysAgo, read: true, type: 'user' }
        ],
        teamId: 2
    },
    {
        id: 7,
        participants: [users[0], users[11]], // Amaka, Prestige Realty
        messages: [
            { id: 12, senderId: 1, text: "Hello, I'm very interested in the Eko Atlantic property. Is it possible to schedule a viewing?", timestamp: twoHoursAgo, read: false, type: 'user' },
        ],
        propertyId: 17,
    }
];

const mockReviewsLekki: NeighborhoodReview[] = [
    {
        id: 1,
        author: users[0],
        ratings: { security: 4, power: 3, internet: 5 },
        text: "Lekki is great for young professionals. The internet is fantastic for remote work, but the traffic can be a nightmare. Security within the estates is generally top-notch.",
        timestamp: oneDayAgo,
    },
    {
        id: 2,
        author: users[3],
        ratings: { security: 5, power: 4, internet: 4 },
        text: "I've been a resident here for years. It's safe, and the community is vibrant. Power has improved recently, especially with many places getting dedicated transformers.",
        timestamp: threeDaysAgo,
    },
];

const mockReviewsYaba: NeighborhoodReview[] = [
    {
        id: 3,
        author: users[1],
        ratings: { security: 3, power: 5, internet: 4 },
        text: "As an agent who works here a lot, I can confirm the power is a huge plus. It's a very central and accessible location, though some streets can feel a bit crowded.",
        timestamp: twoDaysAgo,
    }
];

const mockReviewsIkoyi: NeighborhoodReview[] = [
    {
        id: 4,
        author: users[7],
        ratings: { security: 5, power: 5, internet: 5 },
        text: "Ikoyi is the definition of serene. The roads are good, power is constant, and security is excellent. It's expensive for a reason.",
        timestamp: oneWeekAgo,
    },
    {
        id: 5,
        author: users[8],
        ratings: { security: 4, power: 4, internet: 5 },
        text: "The best fiber internet in Lagos is here. It's an amazing place to live if you can afford it. Lots of green spaces.",
        timestamp: twoWeeksAgo,
    }
];

export const neighborhoods: Neighborhood[] = [
    {
        id: 1,
        name: 'Lekki',
        image: 'https://images.unsplash.com/photo-1605330443069-f0a99a47b13c?q=80&w=3570&auto=format&fit=crop',
        latitude: 6.4475, 
        longitude: 3.4735,
        questions: [
            {
                id: 101,
                text: "What's the average service charge for a 3-bedroom apartment in Lekki Phase 1?",
                author: users[0],
                timestamp: "2024-07-28T12:00:00Z",
                upvotes: 15,
                answers: [
                    { id: 201, text: "It varies wildly depending on the estate, but you should budget between ₦500k and ₦1.2m annually. This usually covers security, waste disposal, and water treatment.", author: users[1], timestamp: "2024-07-28T12:05:00Z" }
                ]
            },
            {
                id: 102,
                text: "Which internet service provider has the best coverage and speed around here?",
                author: users[4],
                timestamp: "2024-07-27T09:30:00Z",
                upvotes: 22,
                answers: []
            }
        ],
        reviews: mockReviewsLekki,
    },
    {
        id: 2,
        name: 'Yaba',
        image: 'https://images.unsplash.com/photo-1599827552680-b3e78f4208e8?q=80&w=3436&auto=format&fit=crop',
        latitude: 6.5134,
        longitude: 3.3865,
        questions: [
            {
                id: 201,
                text: "Is it true that power supply is better in Yaba compared to other parts of the mainland?",
                author: users[0],
                timestamp: "2024-07-29T11:00:00Z",
                upvotes: 8,
                answers: [
                     { id: 301, text: "Yes, especially in areas closer to the universities and the tech hubs. Many places get up to 18-20 hours of power daily on average.", author: users[1], timestamp: "2024-07-29T11:15:00Z" }
                ]
            }
        ],
        reviews: mockReviewsYaba,
    },
    {
        id: 3,
        name: 'Ikoyi',
        image: 'https://images.unsplash.com/photo-1617103995433-4f365313261a?w=800',
        latitude: 6.4531,
        longitude: 3.4284,
        questions: [
            {
                id: 301,
                text: "Are there any good international schools in Ikoyi?",
                author: users[5],
                timestamp: oneWeekAgo,
                upvotes: 12,
                answers: [
                    { id: 401, text: "Absolutely. The British International School and Greenwood House School are both excellent choices in the area.", author: users[7], timestamp: threeDaysAgo }
                ]
            }
        ],
        reviews: mockReviewsIkoyi,
    }
];


export const scheduledTours: ScheduledTour[] = [
    {
        id: 1,
        property: properties[4], // Oniru
        renter: users[6], // Fatima
        agent: users[1], // David
        proposedTimes: [
            new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
            new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
        ],
        status: 'pending',
        createdAt: oneHourAgo,
    },
    {
        id: 2,
        property: properties[0], // Lekki Phase 1
        renter: users[0], // Amaka
        agent: users[1], // David
        proposedTimes: [
            new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        ],
        confirmedTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'confirmed',
        createdAt: oneDayAgo,
    }
];

export const notifications: Notification[] = [
    { id: 1, type: 'message', message: "David sent you a message about the Lekki property.", timestamp: oneHourAgo, read: false, relatedId: 1 },
    { id: 2, type: 'follow', message: "fatima_finds started following you.", timestamp: threeHoursAgo, read: true, relatedId: 7 },
    { id: 3, type: 'like', message: "chioma_luxe liked your property post in Yaba.", timestamp: oneDayAgo, read: true, relatedId: 4 },
    { id: 4, type: 'verification', message: "Your verification of the Oniru property is complete. You've earned ₦6,000!", timestamp: oneDayAgo, read: true, relatedId: 5 },
    { id: 5, type: 'tour', message: "Your tour request for the Lekki Phase 1 property has been confirmed.", timestamp: oneDayAgo, read: false, relatedId: 2 },
];

export const serviceProviders: ServiceProvider[] = [
    { id: 1, name: 'CleanCo Lagos', avatar: 'https://i.pravatar.cc/150?u=cleanco', service: 'Home Cleaning', rating: 4.8, reviewsCount: 120, location: 'Lekki' },
    { id: 2, name: 'Fixit All', avatar: 'https://i.pravatar.cc/150?u=fixit', service: 'Plumbing & Electrical', rating: 4.9, reviewsCount: 250, location: 'Ikeja' },
    { id: 3, name: 'MoveEasy', avatar: 'https://i.pravatar.cc/150?u=moveeasy', service: 'Movers & Packers', rating: 4.7, reviewsCount: 85, location: 'All Lagos' },
];
