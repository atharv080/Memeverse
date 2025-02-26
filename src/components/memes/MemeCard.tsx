// src/components/memes/MemeCard.tsx
'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { HeartIcon, ChatBubbleLeftIcon, ShareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Meme } from '@/lib/types';
import Image from 'next/image';
interface MemeCardProps {
  meme: Meme;
}

export default function MemeCard({ meme }: MemeCardProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(meme.likes);

  useEffect(() => {
    const likedMemes = JSON.parse(localStorage.getItem('likedMemes') || '[]');
    setIsLiked(likedMemes.includes(meme.id));
  }, [meme.id]);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when liking
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    
    const likedMemes = JSON.parse(localStorage.getItem('likedMemes') || '[]');
    if (isLiked) {
      localStorage.setItem('likedMemes', JSON.stringify(likedMemes.filter((id: string) => id !== meme.id)));
    } else {
      localStorage.setItem('likedMemes', JSON.stringify([...likedMemes, meme.id]));
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when sharing
    const url = `${window.location.origin}/meme/${meme.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: meme.title,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  const handleCardClick = () => {
    router.push(`/meme/${meme.id}`);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer"
    >
      <div className="relative aspect-video">
  <Image
    src={meme.imageUrl}
    alt={meme.title}
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
</div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
          {meme.title}
        </h3>
        
        <div className="flex items-center justify-between">
          <button
            onClick={handleLike}
            className="flex items-center space-x-1 text-gray-600 dark:text-gray-300"
          >
            <motion.div
              whileTap={{ scale: 1.2 }}
              className={isLiked ? 'text-red-500' : ''}
            >
              {isLiked ? (
                <HeartSolidIcon className="h-6 w-6" />
              ) : (
                <HeartIcon className="h-6 w-6" />
              )}
            </motion.div>
            <span>{likes}</span>
          </button>

          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
            <ChatBubbleLeftIcon className="h-6 w-6" />
            <span>{meme.comments}</span>
          </div>

          <button
            onClick={handleShare}
            className="text-gray-600 dark:text-gray-300"
          >
            <ShareIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}