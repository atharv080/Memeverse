'use client';

import { useState } from 'react';
import { Button } from '../common/Button';

interface MemeFiltersProps {
  onFilterChange: (category: string) => void;
  onSortChange: (sort: string) => void;
}

export default function MemeFilters({ onFilterChange, onSortChange }: MemeFiltersProps) {
  const [activeCategory, setActiveCategory] = useState('trending');
  const [activeSort, setActiveSort] = useState('likes');

  const categories = [
    { id: 'trending', label: 'Trending' },
    { id: 'new', label: 'New' },
    { id: 'classic', label: 'Classic' },
    { id: 'random', label: 'Random' },
  ];

  const sortOptions = [
    { id: 'likes', label: 'Most Liked' },
    { id: 'date', label: 'Latest' },
    { id: 'comments', label: 'Most Comments' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? 'default' : 'outline'}
            onClick={() => {
              setActiveCategory(category.id);
              onFilterChange(category.id);
            }}
          >
            {category.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {sortOptions.map((option) => (
          <Button
            key={option.id}
            variant={activeSort === option.id ? 'default' : 'outline'}
            onClick={() => {
              setActiveSort(option.id);
              onSortChange(option.id);
            }}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}