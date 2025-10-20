import React, { useState, useMemo } from 'react';
import { User } from '../../types';
import { ArrowLeftIcon, SendIcon } from '../components/Icons';
import QuestionCard from '../components/neighborhood/QuestionCard';
import PropertyPost from '../components/property/PropertyPost';
import UserVerifiedBadge from '../components/common/UserVerifiedBadge';
import NeighborhoodReviewCard from '../components/neighborhood/NeighborhoodReviewCard';
import NeighborhoodRatingSummary from '../components/neighborhood/NeighborhoodRatingSummary';
import { useAppDataStore, useUserStore, useUIStore } from '../store';
import { useGetNeighborhoods, useGetProperties, useGetUsers } from '../hooks/useData';

const AgentCard: React.FC<{ agent: User }> = ({ agent }) => {
    const { viewProfile } = useUIStore();
    return (
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
                <img src={agent.avatar} alt={agent.name} className="w-12 h-12 rounded-full" loading="lazy" />
                <div>
                    <div className="flex items-center gap-1.5">
                        <p className="font-bold text-gray-800">{agent.name}</p>
                        <UserVerifiedBadge user={agent} />
                    </div>
                    <p className="text-xs text-gray-500 truncate max-w-[150px]">{agent.bio}</p>
                </div>
            </div>
            <button 
                onClick={() => viewProfile(agent.id)}
                className="px-3 py-1.5 text-xs font-semibold bg-violet-100 text-violet-700 rounded-full hover:bg-violet-200"
            >
                View Profile
            </button>
        </div>
    );
};

const NeighborhoodHubScreen: React.FC = () => {
    const { modalData, closeModal, viewProfile } = useUIStore();
    const selectedNeighborhoodId = modalData?.neighborhoodId;
    const { addQuestion, addAnswer } = useAppDataStore();
    const { data: neighborhoods } = useGetNeighborhoods();
    const { data: properties } = useGetProperties();
    const { data: users } = useGetUsers();
    const { currentUserId } = useUserStore();
    const currentUser = users?.find(u => u.id === currentUserId);

    const neighborhood = neighborhoods?.find(n => n.id === selectedNeighborhoodId);
    
    const [activeTab, setActiveTab] = useState<'qa' | 'listings' | 'agents' | 'reviews'>('qa');
    const [newQuestion, setNewQuestion] = useState('');

    const verifiedListings = useMemo(() => 
        properties?.filter(p => p.neighborhoodId === neighborhood?.id && p.verificationStatus === 'verified') || [],
        [properties, neighborhood?.id]
    );

    const localAgents = useMemo(() => 
        users?.filter(u => u.agentStatus === 'verified' && u.activeInNeighborhoods?.includes(neighborhood?.id || -1)) || [],
        [users, neighborhood?.id]
    );
    
    const handleAskQuestionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newQuestion.trim() && neighborhood) {
            addQuestion(neighborhood.id, newQuestion.trim());
            setNewQuestion('');
        }
    };
    
    const handleAddAnswerSubmit = (questionId: number, text: string) => {
        if (neighborhood) {
            addAnswer(neighborhood.id, questionId, text);
        }
    };

    if (!neighborhood || !currentUser) {
        return (
            <div className="absolute inset-0 bg-white z-40 flex flex-col items-center justify-center">
                <p>Neighborhood not found.</p>
                <button onClick={closeModal} className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg">Close</button>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 bg-white z-40 flex flex-col">
            <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-20">
                <div className="p-4 flex items-center space-x-4">
                    <button onClick={closeModal} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800">{neighborhood.name} Hub</h1>
                </div>
                 <div className="border-b border-gray-200">
                    <nav className="flex justify-around">
                        <button onClick={() => setActiveTab('qa')} className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${activeTab === 'qa' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500'}`}>Q&A</button>
                        <button onClick={() => setActiveTab('reviews')} className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${activeTab === 'reviews' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500'}`}>Reviews</button>
                        <button onClick={() => setActiveTab('listings')} className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${activeTab === 'listings' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500'}`}>Listings</button>
                        <button onClick={() => setActiveTab('agents')} className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${activeTab === 'agents' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500'}`}>Agents</button>
                    </nav>
                </div>
            </header>

            <main className="flex-grow overflow-y-auto no-scrollbar bg-gray-50">
                {activeTab === 'qa' && (
                    <div className="p-4 space-y-4">
                        {neighborhood.questions.map(q => <QuestionCard key={q.id} question={q} currentUser={currentUser} onViewProfile={viewProfile} onAddAnswer={handleAddAnswerSubmit} />)}
                    </div>
                )}
                {activeTab === 'reviews' && (
                    <div className="p-4 space-y-4">
                        <NeighborhoodRatingSummary reviews={neighborhood.reviews} />
                        {neighborhood.reviews.map(r => <NeighborhoodReviewCard key={r.id} review={r} onViewProfile={viewProfile} />)}
                    </div>
                )}
                {activeTab === 'listings' && (
                    <div className="divide-y divide-gray-100">
                        {verifiedListings.length > 0 ? (
                            verifiedListings.map(p => <PropertyPost key={p.id} property={p} />)
                        ) : (
                            <p className="p-8 text-center text-gray-500">No verified listings in this neighborhood yet.</p>
                        )}
                    </div>
                )}
                {activeTab === 'agents' && (
                    <div className="p-4 space-y-3">
                         {localAgents.length > 0 ? (
                            localAgents.map(agent => <AgentCard key={agent.id} agent={agent} />)
                        ) : (
                            <p className="p-8 text-center text-gray-500">No active agents in this neighborhood yet.</p>
                        )}
                    </div>
                )}
            </main>

            {activeTab === 'qa' && (
                <footer className="p-4 bg-white border-t border-gray-100">
                    <form onSubmit={handleAskQuestionSubmit} className="flex items-center space-x-2">
                    <img src={currentUser.avatar} alt="Your avatar" className="w-9 h-9 rounded-full" />
                    <input
                        type="text"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Ask a question about this neighborhood..."
                        className="flex-grow px-4 py-2 bg-gray-100 rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    <button type="submit" className="p-3 bg-violet-600 text-white rounded-full hover:bg-violet-700 disabled:bg-violet-300" disabled={!newQuestion.trim()}>
                        <SendIcon className="w-5 h-5"/>
                    </button>
                    </form>
                </footer>
            )}
        </div>
    );
};

export default NeighborhoodHubScreen;
