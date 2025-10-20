
import React from 'react';

const ConversationPreviewSkeleton: React.FC = () => {
    return (
        <div className="flex items-start space-x-4 p-4 border-b border-gray-100 animate-pulse">
            <div className="w-14 h-14 rounded-full bg-gray-200"></div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mt-2"></div>
            </div>
            <div className="w-3 h-3 bg-gray-200 rounded-full self-center flex-shrink-0"></div>
        </div>
    );
};

export default ConversationPreviewSkeleton;