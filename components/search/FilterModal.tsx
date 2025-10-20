import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon } from '../Icons';

export interface FilterState {
  type: 'all' | 'rent' | 'sale';
  minPrice: string;
  maxPrice: string;
  beds: number;
  baths: number;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  onClear: () => void;
  initialFilters: FilterState;
}

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="py-4 border-b border-gray-200">
    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    <div className="mt-4">{children}</div>
  </div>
);

const FilterButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 border rounded-full text-sm font-semibold transition-colors ${
      isActive ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
    }`}
  >
    {label}
  </button>
);

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply, onClear, initialFilters }) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  useEffect(() => {
    if (isOpen) {
      setFilters(initialFilters);
    }
  }, [isOpen, initialFilters]);

  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => onApply(filters);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col bg-white transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200">
        <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-bold text-gray-800">Filters</h2>
        <div className="w-10"></div>
      </header>

      <main className="flex-grow overflow-y-auto p-4 space-y-4">
        <FilterSection title="Property Type">
          <div className="flex space-x-2">
            <FilterButton label="All" isActive={filters.type === 'all'} onClick={() => handleFilterChange('type', 'all')} />
            <FilterButton label="For Rent" isActive={filters.type === 'rent'} onClick={() => handleFilterChange('type', 'rent')} />
            <FilterButton label="For Sale" isActive={filters.type === 'sale'} onClick={() => handleFilterChange('type', 'sale')} />
          </div>
        </FilterSection>

        <FilterSection title="Price Range (₦)">
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min price"
              value={filters.minPrice}
              onChange={e => handleFilterChange('minPrice', e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max price"
              value={filters.maxPrice}
              onChange={e => handleFilterChange('maxPrice', e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </FilterSection>

        <FilterSection title="Beds & Baths">
            <div>
                <label className="block text-sm font-medium text-gray-600">Bedrooms</label>
                <div className="flex space-x-2 mt-2 flex-wrap gap-2">
                    {[0, 1, 2, 3, 4].map(num => (
                        <FilterButton key={num} label={num === 0 ? 'Any' : `${num}+`} isActive={filters.beds === num} onClick={() => handleFilterChange('beds', num)} />
                    ))}
                </div>
            </div>
             <div className="mt-4">
                <label className="block text-sm font-medium text-gray-600">Bathrooms</label>
                <div className="flex space-x-2 mt-2 flex-wrap gap-2">
                    {[0, 1, 2, 3, 4].map(num => (
                        <FilterButton key={num} label={num === 0 ? 'Any' : `${num}+`} isActive={filters.baths === num} onClick={() => handleFilterChange('baths', num)} />
                    ))}
                </div>
            </div>
        </FilterSection>
      </main>

      <footer className="flex-shrink-0 p-4 border-t border-gray-200 flex items-center justify-between bg-white">
        <button onClick={onClear} className="px-6 py-3 text-sm font-bold text-gray-800 bg-gray-200 rounded-full hover:bg-gray-300">
          Clear All
        </button>
        <button onClick={handleApply} className="px-8 py-3 text-sm font-bold text-white bg-violet-600 rounded-full hover:bg-violet-700">
          Apply Filters
        </button>
      </footer>
    </div>
  );
};

export default FilterModal;