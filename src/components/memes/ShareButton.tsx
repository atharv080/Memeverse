'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShareIcon } from '@heroicons/react/24/outline';

interface ShareButtonProps {
  memeUrl: string;
}

export default function ShareButton({ memeUrl }: ShareButtonProps) {
  const [isShared, setIsShared] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this meme!',
          url: memeUrl,
        });
      } else {
        await navigator.clipboard.writeText(memeUrl);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <motion.button
      onClick={handleShare}
      className="flex items-center space-x-2 text-gray-600 dark:text-gray-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <ShareIcon className="w-6 h-6" />
      <span>{isShared ? 'Copied!' : 'Share'}</span>
    </motion.button>
  );
}