
import React, { useState, useRef, ReactNode, TouchEvent } from 'react';
import { ArrowDownIcon, CheckCircleIcon, ModernSpinnerIcon } from '../Icons';

interface PullToRefreshProps {
  onRefresh: () => Promise<any>;
  children: ReactNode;
  className?: string;
}

const PULL_THRESHOLD = 80; // pixels to trigger refresh
const PULL_LIMIT = 120; // max pixels to pull down
const REFRESH_COMPLETE_DELAY = 500; // Delay before hiding indicator after refresh

const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children, className }) => {
  const [pullStart, setPullStart] = useState<number | null>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (containerRef.current?.scrollTop === 0 && !isRefreshing && !isSuccess) {
      setPullStart(e.touches[0].clientY);
    } else {
      setPullStart(null);
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (pullStart === null || isRefreshing || isSuccess) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - pullStart;

    if (distance > 0) {
      if (e.cancelable) e.preventDefault();
      setPullDistance(Math.min(distance, PULL_LIMIT));
    }
  };

  const handleTouchEnd = () => {
    if (pullStart === null || isRefreshing || isSuccess) return;

    if (pullDistance > PULL_THRESHOLD) {
      setIsRefreshing(true);
      onRefresh().finally(() => {
        setIsRefreshing(false);
        setIsSuccess(true);
        // Add the requested delay before hiding the indicator
        setTimeout(() => {
            setIsSuccess(false);
            setPullDistance(0);
        }, REFRESH_COMPLETE_DELAY);
      });
    } else {
        setPullDistance(0);
    }
    setPullStart(null);
  };
  
  const indicatorRotation = Math.min(pullDistance / PULL_THRESHOLD, 1) * 180;
  const contentTransform = isRefreshing || isSuccess ? PULL_THRESHOLD / 2 : pullDistance / 2;
  const indicatorOpacity = isRefreshing || isSuccess ? 1 : Math.min(pullDistance / (PULL_THRESHOLD / 2), 1);

  const renderIndicatorIcon = () => {
    if (isRefreshing) {
      return <ModernSpinnerIcon className="w-6 h-6 text-violet-600" />;
    }
    if (isSuccess) {
      return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
    }
    // FIX: Wrapped ArrowDownIcon in a div to apply the dynamic transform style, as the component doesn't accept a `style` prop.
    return (
      <div
        className="transition-transform duration-200"
        style={{ transform: `rotate(${indicatorRotation}deg)` }}
      >
        <ArrowDownIcon
          className="w-6 h-6 text-gray-500"
        />
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-y-auto no-scrollbar ${className || ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-y' }}
    >
        <div
            className="absolute top-0 left-0 right-0 flex justify-center items-center transition-all duration-300"
            style={{ 
              transform: `translateY(${contentTransform - 40}px)`, 
              opacity: indicatorOpacity 
            }}
        >
            <div className="p-2 bg-white rounded-full shadow-lg">
                {renderIndicatorIcon()}
            </div>
        </div>
        <div
            className="transition-transform duration-300"
            style={{ transform: `translateY(${contentTransform}px)` }}
        >
            {children}
        </div>
    </div>
  );
};

export default PullToRefresh;
