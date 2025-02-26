'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface LikeButtonProps {
  memeId: string;
  initialLikes: number;
}

export default function LikeButton({ memeId, initialLikes }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  useEffect(() => {
    // Check if meme is liked from localStorage
    const likedMemes = JSON.parse(localStorage.getItem('likedMemes') || '[]');
    setIsLiked(likedMemes.includes(memeId));
  }, [memeId]);

  const handleLike = () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikes(prev => newIsLiked ? prev + 1 : prev - 1);

    // Update localStorage
    const likedMemes = JSON.parse(localStorage.getItem('likedMemes') || '[]');
    const updatedLikes = newIsLiked 
      ? [...likedMemes, memeId]
      : likedMemes.filter((id: string) => id !== memeId);
    localStorage.setItem('likedMemes', JSON.stringify(updatedLikes));
  };

  return (
    <motion.button
      onClick={handleLike}
      className="flex items-center space-x-2 text-gray-600 dark:text-gray-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isLiked ? 'liked' : 'unliked'}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className={isLiked ? 'text-red-500' : ''}
        >
          {isLiked ? (
            <HeartSolidIcon className="w-6 h-6" />
          ) : (
            <HeartIcon className="w-6 h-6" />
          )}
        </motion.div>
      </AnimatePresence>
      <span>{likes}</span>
    </motion.button>
  );
}