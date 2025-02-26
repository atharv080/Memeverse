// src/components/explore/FilterBar.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import type { CategoryOption, SortOption } from '@/lib/types';

interface FilterBarProps {
  selectedCategory: CategoryOption;
  selectedSort: SortOption;
  onCategoryChange: (category: CategoryOption) => void;
  onSortChange: (sort: SortOption) => void;
}

export default function FilterBar({
  selectedCategory,
  selectedSort,
  onCategoryChange,
  onSortChange,
}: FilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<'filter' | 'sort' | null>(null);

  const filterOptions = [
    { id: 'trending' as CategoryOption, label: 'Trending' },
    { id: 'new' as CategoryOption, label: 'New' },
    { id: 'classic' as CategoryOption, label: 'Classic' },
    { id: 'random' as CategoryOption, label: 'Random' },
  ];

  const sortOptions = [
    { id: 'likes' as SortOption, label: 'Most Liked' },
    { id: 'date' as SortOption, label: 'Latest' },
    { id: 'comments' as SortOption, label: 'Most Comments' },
  ];

  const handleClickOutside = () => {
    setOpenDropdown(null);
  };

  return (
    <div className="flex flex-wrap gap-4">
      {/* Filter Dropdown */}
      <div className="relative">
        <Button
          onClick={() => setOpenDropdown(openDropdown === 'filter' ? null : 'filter')}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <span>Filter</span>
          <ChevronDownIcon 
            className={`w-4 h-4 transition-transform ${
              openDropdown === 'filter' ? 'rotate-180' : ''
            }`}
          />
        </Button>

        <AnimatePresence>
          {openDropdown === 'filter' && (
            <>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5"
              >
                <div className="py-1">
                  {filterOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        onCategoryChange(option.id);
                        setOpenDropdown(null);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        selectedCategory === option.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-0"
                onClick={handleClickOutside}
              />
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Sort Dropdown */}
      <div className="relative">
        <Button
          onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <span>Sort</span>
          <ChevronDownIcon 
            className={`w-4 h-4 transition-transform ${
              openDropdown === 'sort' ? 'rotate-180' : ''
            }`}
          />
        </Button>

        <AnimatePresence>
          {openDropdown === 'sort' && (
            <>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5"
              >
                <div className="py-1">
                  {sortOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        onSortChange(option.id);
                        setOpenDropdown(null);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        selectedSort === option.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-0"
                onClick={handleClickOutside}
              />
            </>
          )}
        </AnimatePresence>
      </div>

      
    </div>
  );
}