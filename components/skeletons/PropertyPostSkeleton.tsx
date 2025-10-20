
import React from 'react';

const PropertyPostSkeleton: React.FC = () => {
  return (
    <div className="p-4 border-b border-gray-100 animate-pulse">
      <div className="flex items-start space-x-3">
        <div className="w-12 h-12 rounded-full bg-gray-200"></div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-5 bg-gray-200 rounded-full w-20"></div>
          </div>
          
          <div className="mt-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
          
          <div className="mt-3 rounded-2xl overflow-hidden bg-gray-200 h-64 w-full"></div>

          <div className="mt-3">
            <div className="flex items-center justify-between">
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded-full w-1/4"></div>
            </div>
            <div className="h-5 bg-gray-200 rounded w-3/4 mt-2"></div>

            <div className="flex items-center space-x-4 mt-2">
                <div className="h-5 bg-gray-200 rounded w-16"></div>
                <div className="h-5 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between max-w-xs">
            <div className="h-5 bg-gray-200 rounded w-12"></div>
            <div className="h-5 bg-gray-200 rounded w-12"></div>
            <div className="h-5 bg-gray-200 rounded w-12"></div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PropertyPostSkeleton;