// src/components/memes/TrendingMemes.tsx
'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setMemes } from '@/store/features/memesSlice';
import MemeCard from './MemeCard';
import type { Meme } from '@/lib/types';

export default function TrendingMemes() {
  const dispatch = useAppDispatch();
  const memes = useAppSelector((state) => state.memes.items);
  interface ApiMeme {
    id: string;
    url: string;
    name: string;
    width: number;
    height: number;
  }
  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const response = await fetch('https://api.imgflip.com/get_memes');
        const data = await response.json();
        
        // Transform the data to match our Meme type
        const transformedMemes: Meme[] = data.data.memes.slice(0, 10).map((meme: ApiMeme) => ({
          id: meme.id,
          title: meme.name,
          imageUrl: meme.url,
          likes: Math.floor(Math.random() * 1000),
          comments: Math.floor(Math.random() * 100),
        }));

        dispatch(setMemes(transformedMemes));
      } catch (error) {
        console.error('Error fetching memes:', error);
      }
    };

    fetchMemes();
  }, [dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {memes.map((meme: Meme) => (
        <MemeCard 
          key={meme.id} 
          meme={meme} 
        />
      ))}
    </motion.div>
  );
}