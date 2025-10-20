import React, { useState } from 'react';
import { CloseIcon } from '../Icons';
import { useUserStore } from '../../store';
import { useGetUsers } from '../../hooks/useData';

interface CreateTeamModalProps {
    onClose: () => void;
    onCreateTeam: (name: string, memberIds: number[]) => void;
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ onClose, onCreateTeam }) => {
    const { data: users } = useGetUsers();
    const { currentUserId } = useUserStore();
    const currentUser = users?.find(u => u.id === currentUserId);
    const [teamName, setTeamName] = useState('');
    const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);

    const availableUsers = users?.filter(u => u.id !== currentUser?.id) || [];

    const handleMemberToggle = (userId: number) => {
        setSelectedMemberIds(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSubmit = () => {
        if (teamName.trim() && selectedMemberIds.length > 0) {
            onCreateTeam(teamName.trim(), selectedMemberIds);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">Create a Search Team</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </header>
                <main className="p-6">
                    <div>
                        <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">Team Name</label>
                        <input
                            type="text"
                            id="teamName"
                            value={teamName}
                            onChange={e => setTeamName(e.target.value)}
                            placeholder="e.g., Lagos Flat Hunt"
                            className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Invite Members</label>
                        <div className="mt-2 border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                            {availableUsers.map(user => (
                                <div key={user.id} className="flex items-center justify-between p-2 border-b border-gray-100 last:border-b-0">
                                    <div className="flex items-center gap-3">
                                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                                        <span>{user.name}</span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={selectedMemberIds.includes(user.id)}
                                        onChange={() => handleMemberToggle(user.id)}
                                        className="h-5 w-5 rounded text-violet-600 focus:ring-violet-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
                <footer className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
                    <button
                        onClick={handleSubmit}
                        disabled={!teamName.trim() || selectedMemberIds.length === 0}
                        className="w-full py-2.5 bg-violet-600 text-white rounded-full font-semibold hover:bg-violet-700 disabled:bg-violet-300"
                    >
                        Create Team & Start Chat
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default CreateTeamModal;
