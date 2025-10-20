import React, { useState, useEffect, useRef, useMemo } from 'react';
// FIX: Changed to named import for FixedSizeList, resolving module export error.
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import DiscoverPost from '../components/discover/DiscoverPost';
import { logger } from '../utils/logger';
import { useGetProperties } from '../hooks/useData';

const DiscoverScreen: React.FC = () => {
  logger.log('Component:DiscoverScreen', 'Component rendering or re-rendering.');
  const { data: allProperties } = useGetProperties();

  const properties = useMemo(() => 
    allProperties?.filter(p => p.images.length > 0 || (p.videos && p.videos.length > 0)) || [],
    [allProperties]
  );
  
  const [activePropertyId, setActivePropertyId] = useState<number | null>(properties[0]?.id || null);

  const DiscoverRow = ({ index, style }: { index: number, style: React.CSSProperties }) => {
    const property = properties[index];
    return (
        <div style={style}>
            <DiscoverPost 
                property={property} 
                isActive={activePropertyId === property.id}
            />
        </div>
    );
  };
  
  if (properties.length === 0) {
    return <div className="h-full w-full bg-black flex items-center justify-center text-white">No discoverable posts available.</div>
  }

  return (
    <div className="relative h-full w-full bg-black">
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            height={height}
            width={width}
            itemCount={properties.length}
            itemSize={height}
            onScroll={({ scrollOffset }) => {
              const activeIndex = Math.round(scrollOffset / height);
              const newActiveId = properties[activeIndex]?.id;
              if (newActiveId && newActiveId !== activePropertyId) {
                setActivePropertyId(newActiveId);
              }
            }}
          >
            {DiscoverRow}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  );
};

export default DiscoverScreen;