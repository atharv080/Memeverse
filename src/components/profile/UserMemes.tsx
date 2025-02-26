'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MemeCard from '@/components/memes/MemeCard';
import { useAppSelector } from '@/store/hooks';

export default function UserMemes() {
  const [activeTab, setActiveTab] = useState<'uploaded' | 'liked'>('uploaded');
  const memes = useAppSelector((state) => state.memes.items);
  const [likedMemes, setLikedMemes] = useState<string[]>([]);

  useEffect(() => {
    // Get liked memes from localStorage
    const stored = localStorage.getItem('likedMemes');
    if (stored) {
      setLikedMemes(JSON.parse(stored));
    }
  }, []);

  const filteredMemes = activeTab === 'uploaded'
    ? memes.slice(0, 3) // Simulate user's uploaded memes
    : memes.filter(meme => likedMemes.includes(meme.id));

  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="space-y-6"
  >
    <div className="space-y-6">
      <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('uploaded')}
          className={`pb-2 px-4 ${
            activeTab === 'uploaded'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500'
          }`}
        >
          Uploaded Memes
        </button>
        <button
          onClick={() => setActiveTab('liked')}
          className={`pb-2 px-4 ${
            activeTab === 'liked'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500'
          }`}
        >
          Liked Memes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMemes.map((meme) => (
          <MemeCard key={meme.id} meme={meme} />
        ))}
      </div>

      {filteredMemes.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No memes found in this category.
        </div>
      )}
    </div>
    </motion.div>
  );
}