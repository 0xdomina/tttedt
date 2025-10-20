import React from 'react';
import { TrashIcon, FlagIcon, UserRemoveIcon } from '../Icons';

interface PostOptionsMenuProps {
    isOwner: boolean;
    onClose: () => void;
    onDelete: () => void;
    onReport: () => void;
    onBlockUser: () => void;
    onMute: () => void;
}

const MenuItem: React.FC<{ label: string; icon: React.ElementType; onClick: () => void; destructive?: boolean }> = ({ label, icon: Icon, onClick, destructive }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-left transition-colors ${
            destructive ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-100'
        }`}
    >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
    </button>
);

const PostOptionsMenu: React.FC<PostOptionsMenuProps> = ({ isOwner, onClose, onDelete, onReport, onBlockUser, onMute }) => {
    
    const handleAction = (action: () => void) => {
        action();
        onClose();
    };

    return (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-20 py-1">
            {isOwner ? (
                <>
                    <MenuItem label="Delete Post" icon={TrashIcon} onClick={() => handleAction(onDelete)} destructive />
                </>
            ) : (
                <>
                    <MenuItem label="Report Post" icon={FlagIcon} onClick={() => handleAction(onReport)} />
                    <MenuItem label="Block User" icon={UserRemoveIcon} onClick={() => handleAction(onBlockUser)} destructive />
                </>
            )}
        </div>
    );
};

export default PostOptionsMenu;