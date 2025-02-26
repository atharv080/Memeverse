// src/components/profile/ProfileHeader.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { PencilIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';

interface User {
  name: string;
  bio: string;
  avatar: string;
}

const defaultUser: User = {
  name: 'Anonymous User',
  bio: 'No bio yet',
  avatar: '/default-avatar.png'
};

export default function ProfileHeader() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<User>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('userProfile');
      return savedUser ? JSON.parse(savedUser) : defaultUser;
    }
    return defaultUser;
  });
  const [tempUser, setTempUser] = useState<User>(user);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        
        reader.onload = () => {
          if (reader.result) {
            setTempUser(prev => ({
              ...prev,
              avatar: reader.result as string
            }));
          }
        };

        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }
  };

  const handleSave = () => {
    setUser(tempUser);
    localStorage.setItem('userProfile', JSON.stringify(tempUser));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempUser(user);
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative w-32 h-32 rounded-full overflow-hidden"
          >
            <Image
              src={isEditing ? tempUser.avatar : user.avatar}
              alt="Profile"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
          {isEditing && (
            <label className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
              <PencilIcon className="w-5 h-5 text-white" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={tempUser.name}
                onChange={(e) => setTempUser(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
              />
              <textarea
                value={tempUser.bio}
                onChange={(e) => setTempUser(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Tell us about yourself"
              />
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {user.bio}
              </p>
            </>
          )}
        </div>

        <div>
          {isEditing ? (
            <div className="space-x-2">
              <Button onClick={handleSave}>
                Save
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}