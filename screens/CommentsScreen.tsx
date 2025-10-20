import React, { useState, useEffect, useRef } from 'react';
import { Comment } from '../types';
import { ArrowLeftIcon, SendIcon } from '../components/Icons';
import UserVerifiedBadge from '../components/common/UserVerifiedBadge';
import { useUIStore, useUserStore } from '../store';
import { useGetProperties, useAddComment, useGetUsers } from '../hooks/useData';

interface CommentItemProps { 
    comment: Comment;
    onViewProfile: (userId: number) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onViewProfile }) => (
  <div className="flex items-start space-x-3">
    <button onClick={() => onViewProfile(comment.user.id)}>
      <img src={comment.user.avatar} alt={comment.user.name} className="w-10 h-10 rounded-full hover:opacity-80 transition-opacity" loading="lazy" />
    </button>
    <div className="flex-1 bg-gray-100 p-3 rounded-xl">
      <button onClick={() => onViewProfile(comment.user.id)} className="text-left group">
          <div className="flex items-center gap-1.5">
              <p className="font-bold text-sm text-gray-800 group-hover:underline">{comment.user.name}</p>
              <UserVerifiedBadge user={comment.user} />
          </div>
          <p className="text-xs text-gray-500">@{comment.user.username}</p>
      </button>
      <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
    </div>
  </div>
);

const CommentsScreen: React.FC = () => {
  const { selectedProperty, closeModal, viewProfile } = useUIStore();
  const { currentUserId } = useUserStore();
  const { data: users } = useGetUsers();
  const { data: properties } = useGetProperties();
  const addCommentMutation = useAddComment();

  const currentUser = users?.find(u => u.id === currentUserId);
  
  const property = properties?.find(p => p.id === selectedProperty?.id);
  const comments = property?.comments || [];
  
  const [newComment, setNewComment] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === '' || !property) return;
    addCommentMutation.mutate({ propertyId: property.id, text: newComment.trim() });
    setNewComment('');
  };
  
  if (!property || !currentUser) return null;

  return (
    <div className="absolute inset-0 z-30 flex flex-col h-full bg-white">
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-gray-200 p-4 flex items-center space-x-4">
        <button onClick={closeModal} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">{comments.length} Comments</h1>
      </header>
      
      <main className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar">
        {comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} onViewProfile={viewProfile} />
        ))}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handlePostComment} className="flex items-center space-x-2">
          <img src={currentUser.avatar} alt="Your avatar" className="w-9 h-9 rounded-full" loading="lazy" />
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-grow px-4 py-2 bg-gray-100 rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-violet-500 caret-black"
          />
          <button type="submit" className="p-3 bg-violet-600 text-white rounded-full hover:bg-violet-700 disabled:bg-violet-300" disabled={!newComment.trim() || addCommentMutation.isPending}>
            <SendIcon className="w-5 h-5"/>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default CommentsScreen;
