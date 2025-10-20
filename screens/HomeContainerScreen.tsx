import React, { useState, useRef, useEffect } from 'react';
import HomeScreen from './HomeScreen';
import DiscoverScreen from './DiscoverScreen';
import { logger } from '../utils/logger';
import { usePropertyStore } from '../store';

const HomeContainerScreen: React.FC = () => {
  logger.log('Component:HomeContainerScreen', 'Component rendering or re-rendering.');
  const [activeView, setActiveView] = useState<'feed' | 'discover'>('feed');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    logger.log('Component:HomeContainerScreen', 'State changed: activeView', { activeView });
  }, [activeView]);
  
  const handleSwitchView = (view: 'feed' | 'discover') => {
    if (scrollContainerRef.current) {
        const screenWidth = scrollContainerRef.current.offsetWidth;
        scrollContainerRef.current.scrollTo({
            left: view === 'feed' ? 0 : screenWidth,
            behavior: 'smooth'
        });
    }
    setActiveView(view);
  };
  
  useEffect(() => {
    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, offsetWidth } = scrollContainerRef.current;
            const newView = scrollLeft < offsetWidth / 2 ? 'feed' : 'discover';
            if (newView !== activeView) {
                 setActiveView(newView);
            }
        }
    };

    const container = scrollContainerRef.current;
    if (container) {
        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [activeView]);

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <header className="flex-shrink-0 bg-white/80 backdrop-blur-sm z-30 border-b border-gray-200">
        <div className="flex justify-center items-center gap-8 p-3">
          <button onClick={() => handleSwitchView('feed')} className={`font-bold transition-colors ${activeView === 'feed' ? 'text-violet-600' : 'text-gray-400'}`}>
            For You
            {activeView === 'feed' && <div className="w-full h-1 bg-violet-600 rounded-full mt-1"></div>}
          </button>
          <button onClick={() => handleSwitchView('discover')} className={`font-bold transition-colors ${activeView === 'discover' ? 'text-violet-600' : 'text-gray-400'}`}>
            Discover
            {activeView === 'discover' && <div className="w-full h-1 bg-violet-600 rounded-full mt-1"></div>}
          </button>
        </div>
      </header>

      <main 
        ref={scrollContainerRef}
        className="flex-1 flex w-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
      >
        <div className="w-full flex-shrink-0 snap-start h-full overflow-y-auto no-scrollbar">
            <HomeScreen />
        </div>
        <div className="w-full flex-shrink-0 snap-start h-full overflow-hidden">
            <DiscoverScreen />
        </div>
      </main>
    </div>
  );
};

export default HomeContainerScreen;