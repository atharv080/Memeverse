// src/app/leaderboard/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrophyIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Meme } from '@/types';

// Separate components for better performance
const MemeCard = ({ meme, index, onClick }: { meme: Meme; index: number; onClick: () => void }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ scale: 1.01 }}
    className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer"
    onClick={onClick}
  >
    <span className={`text-2xl font-bold ${
      index === 0 ? 'text-yellow-500' :
      index === 1 ? 'text-gray-400' :
      index === 2 ? 'text-amber-600' :
      'text-gray-500'
    }`}>
      #{index + 1}
    </span>
    <div className="relative w-16 h-16">
      <Image
        src={meme.imageUrl}
        alt={meme.title}
        fill
        className="object-cover rounded"
        sizes="64px"
        loading={index < 3 ? "eager" : "lazy"}
      />
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="font-medium text-gray-900 dark:text-white truncate">
        {meme.title}
      </h3>
      <p className="text-sm text-gray-500">
        {meme.likes} likes • {meme.comments} comments
      </p>
    </div>
  </motion.div>
);

const UserCard = ({ user, index }: { user: UserRanking; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ scale: 1.01 }}
    className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
  >
    {index < 3 ? (
      <TrophyIcon className={`h-8 w-8 ${
        index === 0 ? 'text-yellow-500' :
        index === 1 ? 'text-gray-400' :
        'text-amber-600'
      }`} />
    ) : (
      <span className="text-xl font-bold text-gray-500 w-8">
        #{index + 1}
      </span>
    )}
    
    <UserCircleIcon className="h-10 w-10 text-gray-400 flex-shrink-0" />
    
    <div className="flex-1 min-w-0">
      <h3 className="font-medium text-gray-900 dark:text-white truncate">
        {user.username}
      </h3>
      <p className="text-sm text-gray-500 truncate">
        {user.points} points • {user.memesCount} memes • {user.likesReceived} likes
      </p>
    </div>
  </motion.div>
);

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

interface UserRanking {
  id: string;
  username: string;
  points: number;
  memesCount: number;
  likesReceived: number;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [topMemes, setTopMemes] = useState<ProcessedMeme[]>([]);
  const [topUsers, setTopUsers] = useState<UserRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const fetchLeaderboardData = async () => {
       try {
        const response = await fetch('https://api.imgflip.com/get_memes');
        const data = await response.json();

        if (!mounted) return;

        // Process top memes
        const processedMemes = data.data.memes
          .slice(0, 10)
          .map((meme: ApiMeme) => ({
            id: meme.id,
            title: meme.name,
            imageUrl: meme.url,
            likes: Math.floor(Math.random() * 1000),
            comments: Math.floor(Math.random() * 100),
            createdAt: new Date().toISOString(),
          }));

        // Generate mock users
        const mockUsers: UserRanking[] = Array.from({ length: 10 }, (_, i) => ({
          id: `user${i + 1}`,
          username: `MemeKing${i + 1}`,
          points: Math.floor(Math.random() * 10000),
          memesCount: Math.floor(Math.random() * 50),
          likesReceived: Math.floor(Math.random() * 5000),
        })).sort((a, b) => b.points - a.points);

        setTopMemes(processedMemes);
        setTopUsers(mockUsers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        if (mounted) setLoading(false);
      }
    };

    fetchLeaderboardData();
    return () => { setMounted(false); };
  }, [mounted]);

  // Memoize the navigation handler
  const handleMemeClick = useMemo(() => 
    (memeId: string) => () => router.push(`/meme/${memeId}`),
    [router]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Leaderboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Memes Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            Top 10 Memes
          </h2>
          <div className="space-y-4">
            {topMemes.map((meme, index) => (
              <MemeCard
                key={meme.id}
                meme={meme}
                index={index}
                onClick={handleMemeClick(meme.id)}
              />
            ))}
          </div>
        </section>

        {/* Top Users Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            Top Contributors
          </h2>
          <div className="space-y-4">
            {topUsers.map((user, index) => (
              <UserCard
                key={user.id}
                user={user}
                index={index}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}