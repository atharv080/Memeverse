// src/app/meme/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import LikeButton from '@/components/memes/LikeButton';
import ShareButton from '@/components/memes/ShareButton';
import CommentSection from '@/components/memes/CommentSection';
import { Meme } from '@/lib/types';

export default function MemePage() {
  const { id } = useParams();
  const router = useRouter();
  const [meme, setMeme] = useState<Meme | null>(null);
  const [loading, setLoading] = useState(true);
  interface ApiMeme {
    id: string;
    url: string;
    name: string;
    width: number;
    height: number;
  }
  useEffect(() => {
    const fetchMeme = async () => {
      try {
        const response = await fetch('https://api.imgflip.com/get_memes');
        const data = await response.json();
        const foundMeme = data.data.memes.find((m: ApiMeme) => m.id === id);
        
        if (foundMeme) {
          setMeme({
            id: foundMeme.id,
            title: foundMeme.name,
            imageUrl: foundMeme.url,
            likes: Math.floor(Math.random() * 1000),
            comments: Math.floor(Math.random() * 100),
          });
        }
      } catch (error) {
        console.error('Error fetching meme:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeme();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!meme) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Meme not found
        </h1>
        <button
          onClick={() => router.back()}
          className="mt-4 text-blue-500 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto py-8 px-4 space-y-8"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <div className="relative aspect-video">
          <Image
            src={meme.imageUrl}
            alt={meme.title}
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {meme.title}
          </h1>

          <div className="flex items-center space-x-6">
            <LikeButton memeId={meme.id} initialLikes={meme.likes} />
            <ShareButton memeUrl={window.location.href} />
          </div>
        </div>
      </div>

      <div className="space-y-4" id="comments">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Comments
        </h2>
        <CommentSection memeId={meme.id} />
      </div>
    </motion.div>
  );
}