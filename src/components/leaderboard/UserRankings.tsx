'use client';

import { motion } from 'framer-motion';
import { TrophyIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface UserRank {
  id: string;
  username: string;
  avatar?: string;
  points: number;
  rank: number;
}

const mockUsers: UserRank[] = [
  { id: '1', username: 'MemeKing', points: 1500, rank: 1 },
  { id: '2', username: 'MemeQueen', points: 1200, rank: 2 },
  { id: '3', username: 'MemeLord', points: 1000, rank: 3 },
  // Add more mock users
];

export default function UserRankings() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6">Top Contributors</h2>
      <div className="space-y-4">
        {mockUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            {index < 3 ? (
              <TrophyIcon 
                className={`h-8 w-8 ${
                  index === 0 ? 'text-yellow-400' :
                  index === 1 ? 'text-gray-400' :
                  'text-bronze-400'
                }`}
              />
            ) : (
              <span className="text-xl font-bold text-gray-400 w-8">
                #{index + 1}
              </span>
            )}
            
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.username}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <UserCircleIcon className="w-10 h-10 text-gray-400" />
            )}
            
            <div className="flex-1">
              <p className="font-medium">{user.username}</p>
              <p className="text-sm text-gray-500">{user.points} points</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}