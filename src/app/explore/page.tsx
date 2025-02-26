'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '@/components/explore/SearchBar';
import FilterBar from '@/components/explore/FilterBar';
import MemeGrid from '@/components/explore/MemeGrid';
import type { Meme, SortOption, CategoryOption } from '@/types';

interface ApiMeme {
  id: string;
  url: string;
  name: string;
  width: number;
  height: number;
}

interface ProcessedMeme extends Meme {
  createdAt: string;
}

const ITEMS_PER_PAGE = 12;

export default function ExplorePage() {
  const [memes, setMemes] = useState<ProcessedMeme[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption>('trending');
  const [selectedSort, setSelectedSort] = useState<SortOption>('likes');
  const [allMemes, setAllMemes] = useState<ProcessedMeme[]>([]);

  // Fetch all memes initially
  useEffect(() => {
    const fetchAllMemes = async () => {
      try {
        const response = await fetch('https://api.imgflip.com/get_memes');
        const data = await response.json();
        
        const processedMemes: ProcessedMeme[] = data.data.memes.map((meme: ApiMeme) => ({
          id: meme.id,
          title: meme.name,
          imageUrl: meme.url,
          likes: Math.floor(Math.random() * 1000),
          comments: Math.floor(Math.random() * 100),
          createdAt: new Date().toISOString(),
        }));

        setAllMemes(processedMemes);
      } catch (error) {
        console.error('Error fetching memes:', error);
      }
    };

    fetchAllMemes();
  }, []);

  // Filter and sort memes based on current selections
  const getFilteredMemes = useCallback(() => {
    let filtered = [...allMemes];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(meme => 
        meme.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    switch (selectedCategory) {
      case 'new':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'trending':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'random':
        filtered.sort(() => Math.random() - 0.5);
        break;
      case 'classic':
        // You can define what makes a meme 'classic'
        filtered = filtered.slice(0, 20); // Example: first 20 memes are classics
        break;
    }

    // Apply sort
    switch (selectedSort) {
      case 'likes':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'date':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'comments':
        filtered.sort((a, b) => b.comments - a.comments);
        break;
    }

    return filtered;
  }, [allMemes, searchQuery, selectedCategory, selectedSort]);

  // Load more memes
  const loadMoreMemes = useCallback(() => {
    const filtered = getFilteredMemes();
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newMemes = filtered.slice(startIndex, endIndex);

    setMemes(prev => [...prev, ...newMemes]);
    setHasMore(endIndex < filtered.length);
    setLoading(false);
  }, [page, getFilteredMemes]);

  // Reset and reload when filters change
  useEffect(() => {
    setMemes([]);
    setPage(1);
    setLoading(true);
    
    setTimeout(() => {
      const filtered = getFilteredMemes();
      const initialMemes = filtered.slice(0, ITEMS_PER_PAGE);
      setMemes(initialMemes);
      setHasMore(filtered.length > ITEMS_PER_PAGE);
      setLoading(false);
    }, 500);
  }, [searchQuery, selectedCategory, selectedSort, getFilteredMemes]);

  const handleLoadMore = () => {
    setLoading(true);
    setPage(prev => prev + 1);
  };

  useEffect(() => {
    if (page > 1) {
      loadMoreMemes();
    }
  }, [page, loadMoreMemes]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto py-8 px-4 space-y-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Explore Memes
      </h1>

      <div className="space-y-6">
        <SearchBar onSearch={setSearchQuery} />
        
        <FilterBar
          selectedCategory={selectedCategory}
          selectedSort={selectedSort}
          onCategoryChange={setSelectedCategory}
          onSortChange={setSelectedSort}
        />
      </div>

      <MemeGrid
        memes={memes}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      />
    </motion.div>
  );
}