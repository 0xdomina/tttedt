import React, { useState } from 'react';
import { Question, User } from '../../types';
import { ArrowUpIcon, MessageCircleIcon, SendIcon } from '../Icons';
import UserVerifiedBadge from '../common/UserVerifiedBadge';

interface QuestionCardProps {
    question: Question;
    currentUser: User;
    onViewProfile: (userId: number) => void;
    onAddAnswer: (questionId: number, text: string) => void;
}

const AnswerForm: React.FC<{ onSubmit: (text: string) => void; currentUser: User }> = ({ onSubmit, currentUser }) => {
    const [text, setText] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(text.trim()) {
            onSubmit(text.trim());
            setText('');
        }
    };
    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full flex-shrink-0" loading="lazy" />
            <input 
                type="text"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Write an answer..."
                className="flex-grow px-3 py-1.5 bg-gray-100 rounded-full border border-transparent focus:outline-none focus:ring-1 focus:ring-violet-500 text-sm"
                autoFocus
            />
            <button type="submit" className="p-2 bg-violet-600 text-white rounded-full hover:bg-violet-700 disabled:bg-violet-300" disabled={!text.trim()}>
                <SendIcon className="w-4 h-4" />
            </button>
        </form>
    );
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question, currentUser, onViewProfile, onAddAnswer }) => {
    const [upvotes, setUpvotes] = useState(question.upvotes);
    const [isUpvoted, setIsUpvoted] = useState(false);
    const [showAnswerForm, setShowAnswerForm] = useState(false);

    const handleUpvote = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isUpvoted) {
            setUpvotes(v => v - 1);
        } else {
            setUpvotes(v => v + 1);
        }
        setIsUpvoted(!isUpvoted);
    };

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-start gap-3">
                <button 
                    onClick={() => onViewProfile(question.author.id)}
                    className="flex-shrink-0"
                >
                    <img src={question.author.avatar} alt={question.author.name} className="w-10 h-10 rounded-full" loading="lazy" />
                </button>
                <div className="flex-1">
                    <button 
                        onClick={() => onViewProfile(question.author.id)}
                        className="text-left group"
                    >
                        <div className="flex items-center gap-1.5">
                            <p className="font-bold text-sm text-gray-800 group-hover:underline">{question.author.name}</p>
                            <UserVerifiedBadge user={question.author} />
                        </div>
                        <p className="text-xs text-gray-500">@{question.author.username}</p>
                    </button>
                    <p className="mt-1 text-gray-800">{question.text}</p>
                </div>
            </div>
            
            <div className="flex items-center justify-end gap-4 mt-3 pt-3 border-t border-gray-100">
                <button 
                    onClick={handleUpvote} 
                    className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${isUpvoted ? 'text-violet-600' : 'text-gray-500 hover:text-violet-500'}`}
                >
                    <ArrowUpIcon className="w-4 h-4" />
                    <span>{upvotes}</span>
                </button>
                <button 
                    onClick={() => setShowAnswerForm(prev => !prev)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-violet-500"
                >
                    <MessageCircleIcon className="w-4 h-4" />
                    <span>{question.answers.length} {question.answers.length === 1 ? 'Answer' : 'Answers'}</span>
                </button>
            </div>
            
            {showAnswerForm && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <AnswerForm onSubmit={(text) => onAddAnswer(question.id, text)} currentUser={currentUser} />
                </div>
            )}

            {question.answers.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <h4 className="text-xs font-bold text-gray-600 mb-2">Answers</h4>
                    {question.answers.map(answer => (
                         <div key={answer.id} className="flex items-start gap-2 mt-2">
                             <button onClick={() => onViewProfile(answer.author.id)} className="flex-shrink-0">
                                <img src={answer.author.avatar} alt={answer.author.name} className="w-8 h-8 rounded-full" loading="lazy" />
                            </button>
                             <div className="flex-1 bg-gray-100 p-2 rounded-lg text-sm">
                                 <button onClick={() => onViewProfile(answer.author.id)} className="text-left group">
                                     <div className="flex items-center gap-1">
                                        <p className="font-bold text-gray-800 group-hover:underline">{answer.author.name}</p>
                                        <UserVerifiedBadge user={answer.author} />
                                     </div>
                                     <p className="text-xs text-gray-500">@{answer.author.username}</p>
                                 </button>
                                 <p className="text-gray-700">{answer.text}</p>
                             </div>
                         </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuestionCard;