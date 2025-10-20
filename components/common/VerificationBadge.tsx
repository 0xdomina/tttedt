import React from 'react';
import { AnimatedGoldenCheckIcon, ClockIcon, ShieldExclamationIcon } from '../Icons';

interface VerificationBadgeProps {
  status: 'unverified' | 'pending' | 'verified';
  verifierName?: string;
  onClick?: () => void;
  actionText?: string;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({ status, verifierName, onClick, actionText }) => {
  if (status === 'verified') {
    return (
        <div className="flex items-center justify-center w-6 h-6" title="edQorta-Verified">
            <AnimatedGoldenCheckIcon className="w-full h-full" />
        </div>
    );
  }
  
  const baseClasses = "text-xs font-semibold px-2.5 py-1 rounded-full flex items-center space-x-1.5 transition-colors";
  
  const commonProps = {
    className: `${baseClasses} ${
      status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
      onClick ? 'bg-violet-100 text-violet-800 hover:bg-violet-200 cursor-pointer' : 'bg-gray-200 text-gray-700'
    }`,
    onClick: onClick,
    disabled: !onClick,
  };

  const content = {
      pending: (
          <>
            <ClockIcon className="w-4 h-4" />
            <span>Pending</span>
          </>
      ),
      unverified: (
          <>
             <ShieldExclamationIcon className="w-4 h-4" />
             <span>{onClick && actionText ? actionText : 'Unverified'}</span>
          </>
      ),
  };
  
  const BadgeContent = () => (status === 'pending' ? content.pending : content.unverified);
  
  if(onClick) {
      return (
        <button {...commonProps}>
            <BadgeContent />
        </button>
      )
  }

  return (
    <div className={commonProps.className}>
      <BadgeContent />
    </div>
  );
};

export default VerificationBadge;