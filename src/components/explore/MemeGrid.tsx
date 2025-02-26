// src/components/explore/MemeGrid.tsx
'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import type { Meme } from '@/lib/types/index';

interface MemeGridProps {
  memes: Meme[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const imageHoverVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3
    }
  }
};

export default function MemeGrid({ memes, loading, hasMore, onLoadMore }: MemeGridProps) {
  const router = useRouter();
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasMore && !loading) {
      onLoadMore();
    }
  }, [inView, hasMore, loading, onLoadMore]);

  const handleMemeClick = (memeId: string) => {
    router.push(`/meme/${memeId}`);
  };

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {memes.map((meme, index) => (
            <motion.div
              key={`${meme.id}-${index}`}
              variants={itemVariants}
              layout
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer
                       transform-gpu hover:shadow-xl transition-shadow"
              onClick={() => handleMemeClick(meme.id)}
            >
              <motion.div 
                className="relative aspect-video overflow-hidden"
                whileHover="hover"
              >
                <motion.div
                  variants={imageHoverVariants}
                  className="relative w-full h-full"
                >
                  <Image
                    src={meme.imageUrl}
                    alt={meme.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {meme.title}
                </h3>
                <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center"
                  >
                    ❤️ {meme.likes}
                  </motion.span>
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center"
                  >
                    💬 {meme.comments}
                  </motion.span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Infinite scroll trigger */}
      <div ref={ref} className="h-10" />

      {/* Loading indicator */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-center py-4"
          >
            <motion.div
              animate={{ 
                rotate: 360,
                transition: {
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }
              }}
              className="rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* No more memes indicator */}
      <AnimatePresence>
        {!hasMore && !loading && memes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-8 text-gray-500 dark:text-gray-400"
          >
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}