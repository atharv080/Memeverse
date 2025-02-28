// src/components/profile/MemeTabs.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FolderIcon,TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';
import MemeCard from '@/components/memes/MemeCard';
import type { Meme } from '@/lib/types';

// Define the API response type
interface ApiMeme {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
}

interface ApiResponse {
  data: {
    memes: ApiMeme[];
  };
}

export default function MemeTabs() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'uploaded' | 'liked'>('uploaded');
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMemes = async () => {
      setLoading(true);
      try {
        if (activeTab === 'liked') {
          // Existing liked memes logic remains the same
          const likedMemeIds = JSON.parse(localStorage.getItem('likedMemes') || '[]');
          const response = await fetch('https://api.imgflip.com/get_memes');
          const data: ApiResponse = await response.json();
          
          const likedMemes = data.data.memes
            .filter((meme: ApiMeme) => likedMemeIds.includes(meme.id))
            .map((meme: ApiMeme) => ({
              id: meme.id,
              title: meme.name,
              imageUrl: meme.url,
              likes: Math.floor(Math.random() * 1000),
              comments: Math.floor(Math.random() * 100),
              creator: {
                id: '1',
                username: 'Anonymous',
              },
              createdAt: new Date().toISOString(),
            }));

          setMemes(likedMemes);
        } else {
          // New logic for uploaded memes
          const uploadedMemes = JSON.parse(localStorage.getItem('uploadedMemes') || '[]');
          console.log('Fetched uploaded memes:', uploadedMemes); // Debug log
          setMemes(uploadedMemes);
        }
      } catch (error) {
        console.error('Error fetching memes:', error);
        setMemes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMemes();
  }, [activeTab]);
  const handleDelete = (memeId: string) => {
    try {
      // Get current memes from localStorage
      const currentMemes = JSON.parse(localStorage.getItem('uploadedMemes') || '[]');
      
      // Filter out the deleted meme
      const updatedMemes = currentMemes.filter((meme: Meme) => meme.id !== memeId);
      
      // Update localStorage
      localStorage.setItem('uploadedMemes', JSON.stringify(updatedMemes));
      
      // Update state
      setMemes(updatedMemes);
      
      console.log('Meme deleted successfully');
    } catch (error) {
      console.error('Error deleting meme:', error);
    }
  };
  return (
    <div className="mt-8">
      {/* Tab Navigation */}
      <nav className="border-b border-gray-700">
        <div className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('uploaded')}
            className={`py-4 px-1 relative ${
              activeTab === 'uploaded'
                ? 'text-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Uploaded Memes
            {activeTab === 'uploaded' && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-500"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('liked')}
            className={`py-4 px-1 relative ${
              activeTab === 'liked'
                ? 'text-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Liked Memes
            {activeTab === 'liked' && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-500"
              />
            )}
          </button>
        </div>
      </nav>

      {/* Content Area */}
      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : memes.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {memes.map((meme) => (
               <div key={meme.id} className="relative group">
               <MemeCard meme={meme} />
               {activeTab === 'uploaded' && (
                 <button
                   onClick={(e) => {
                     e.stopPropagation();
                     handleDelete(meme.id);
                   }}
                   className="absolute top-2 right-2 p-2 bg-red-500 rounded-full 
                            hover:bg-red-600 transition-colors z-20
                            opacity-0 group-hover:opacity-100"
                 >
                   <TrashIcon className="h-5 w-5 text-white" />
                 </button>
               )}
             </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-gray-400"
          >
            <FolderIcon className="w-16 h-16 mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {activeTab === 'uploaded' ? 'No memes uploaded yet' : 'No liked memes yet'}
            </h3>
            <p className="text-sm mb-4">
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
          </motion.div>
        )}
      </div>
    </div>
  );
}