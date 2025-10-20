import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { opacity: 0, scale: 0.95, y: 20 },
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={backdropVariants}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={e => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                        <p className="mt-2 text-gray-600">
                            {message}
                        </p>
                        <div className="mt-6 flex justify-center space-x-4">
                            <button 
                                onClick={onClose} 
                                className="px-6 py-2.5 text-sm font-semibold bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300"
                            >
                                {cancelText}
                            </button>
                            <button 
                                onClick={onConfirm}
                                className="px-6 py-2.5 text-sm font-semibold bg-red-600 text-white rounded-full hover:bg-red-700"
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;