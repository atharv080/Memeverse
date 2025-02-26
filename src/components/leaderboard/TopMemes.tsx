'use client';

import { motion } from 'framer-motion';
import { useAppSelector } from '@/store/hooks';
import Link from 'next/link';

export default function TopMemes() {
  const memes = useAppSelector((state) => state.memes.items);

  // Sort memes by likes
  const topMemes = [...memes]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 10);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6">Top 10 Memes</h2>
      <div className="space-y-4">
        {topMemes.map((meme, index) => (
          <motion.div
            key={meme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <span className="text-2xl font-bold text-gray-400 w-8">
              #{index + 1}
            </span>
            <img
              src={meme.imageUrl}
              alt={meme.title}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <Link 
                href={`/meme/${meme.id}`}
                className="font-medium hover:text-blue-500"
              >
                {meme.title}
              </Link>
              <p className="text-sm text-gray-500">
                {meme.likes} likes • {meme.comments} comments
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}