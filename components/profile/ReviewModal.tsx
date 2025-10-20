import React, { useState } from 'react';
import { StarIcon } from '../Icons';
import { useUIStore } from '../../store';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number, text: string) => void;
}

const InteractiveStarRating: React.FC<{ rating: number; setRating: (rating: number) => void }> = ({ rating, setRating }) => {
    const [hoverRating, setHoverRating] = useState(0);
    return (
        <div className="flex items-center justify-center space-x-2" onMouseLeave={() => setHoverRating(0)}>
            {[...Array(5)].map((_, i) => {
                const starValue = i + 1;
                return (
                    <button
                        type="button"
                        key={i}
                        className="transition-transform transform hover:scale-125"
                        onClick={() => setRating(starValue)}
                        onMouseEnter={() => setHoverRating(starValue)}
                        aria-label={`Rate ${starValue} stars`}
                    >
                        <StarIcon
                            className={`w-10 h-10 transition-colors ${
                                starValue <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            filled={starValue <= (hoverRating || rating)}
                        />
                    </button>
                );
            })}
        </div>
    );
};


const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const { selectedUser: userToReview } = useUIStore();
    const [rating, setRating] = useState(0);
    const [text, setText] = useState('');

    if (!isOpen || !userToReview) return null;

    const handleSubmit = () => {
        if (rating > 0 && text.trim()) {
            onSubmit(rating, text);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-gray-800">Leave a review for {userToReview.name}</h2>
                <img src={userToReview.avatar} alt={userToReview.name} className="w-20 h-20 rounded-full mx-auto mt-4 mb-4" loading="lazy" />

                <div className="my-4">
                    <InteractiveStarRating rating={rating} setRating={setRating} />
                </div>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={`How was your experience with ${userToReview.name}?`}
                    className="w-full mt-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition resize-none"
                    rows={4}
                />
                
                <div className="mt-6 flex justify-center space-x-4">
                    <button 
                        onClick={onClose} 
                        className="px-6 py-2.5 text-sm font-semibold bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={rating === 0 || !text.trim()}
                        className="px-6 py-2.5 text-sm font-semibold bg-violet-600 text-white rounded-full hover:bg-violet-700 disabled:bg-violet-300"
                    >
                        Submit Review
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;