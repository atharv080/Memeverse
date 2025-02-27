// src/components/profile/UserMemes.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MemeCard from '@/components/memes/MemeCard';
import { Button } from '@/components/common/Button';
import { useRouter } from 'next/navigation';
import { FolderIcon } from '@heroicons/react/24/outline';
import { Meme } from '@/lib/types';
export default function UserMemes() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'uploaded' | 'liked'>('uploaded');
  const [memes, setMemes] = useState<Meme[]>([]);

  useEffect(() => {
    // Load appropriate memes based on active tab
    const loadMemes = () => {
      if (activeTab === 'uploaded') {
        const uploadedMemes = JSON.parse(localStorage.getItem('uploadedMemes') || '[]');
        setMemes(uploadedMemes);
      } else {
        const likedMemes = JSON.parse(localStorage.getItem('likedMemes') || '[]');
        setMemes(likedMemes);
      }
    };

    loadMemes();
  }, [activeTab]);

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
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500'
          }`}
        >
          Uploaded Memes
        </button>
        <button
          onClick={() => setActiveTab('liked')}
          className={`pb-2 px-4 ${
            activeTab === 'liked'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500'
          }`}
        >
          Liked Memes
        </button>
      </div>

      {memes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memes.map((meme) => (
            <MemeCard key={meme.id} meme={meme} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FolderIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {activeTab === 'uploaded' ? 'No memes uploaded yet' : 'No liked memes yet'}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {activeTab === 'uploaded' 
              ? 'Start sharing your humor with the world!'
              : 'Start liking memes to see them here!'}
          </p>
          <Button
            onClick={() => router.push(activeTab === 'uploaded' ? '/upload' : '/explore')}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {activeTab === 'uploaded' ? 'Upload Your First Meme' : 'Explore Memes'}
          </Button>
        </div>
      )}
    </div>
    </motion.div>
  );
}