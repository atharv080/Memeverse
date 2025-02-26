// src/app/not-found.tsx
'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';

// Animation variants
const containerVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

// All possible messages and images
const messages = [
  "Looks like this meme pulled a disappearing act! 🎩✨",
  "404: Meme not found. It's probably making coffee ☕",
  "This page is playing hide and seek... and winning! 🙈",
  "Oops! The memes escaped through this portal 🌀",
  "Even John Cena can't see this page 👋",
];

const memeImages = [
  "/404-memes/confused-travolta.gif",
  "/404-memes/surprised-pikachu.png",
  "/404-memes/this-is-fine.png",
  "/404-memes/sad-pablo.png",
];

// Initial content (for SSR)
const defaultContent = {
  message: messages[0],
  image: memeImages[0]
};

export default function NotFound() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    setMounted(true);

    // Generate random content after mount
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const randomImage = memeImages[Math.floor(Math.random() * memeImages.length)];
    
    setContent({
      message: randomMessage,
      image: randomImage
    });
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-gray-950">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="text-center space-y-8 max-w-2xl"
      >
        {/* 404 Text */}
        <motion.div
          variants={itemVariants}
          className="relative"
        >
          <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800">
            404
          </h1>
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
              transition: { 
                repeat: Infinity, 
                duration: 5,
                ease: "easeInOut"
              }
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="text-6xl">😵</span>
          </motion.div>
        </motion.div>

        {/* Message */}
        <motion.h2
          variants={itemVariants}
          className="text-2xl font-semibold text-gray-900 dark:text-white"
        >
          {content.message}
        </motion.h2>

        {/* Meme Image */}
        <motion.div
          variants={itemVariants}
          className="relative w-full max-w-md mx-auto"
          whileHover={{ scale: 1.05 }}
        >
          <Image
            src={content.image}
            alt="404 Meme"
            width={400}
            height={400}
            className="rounded-lg shadow-xl"
            priority
          />
        </motion.div>

        {/* Buttons */}
        <motion.div
          variants={itemVariants}
          className="space-x-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium 
                     hover:bg-blue-600 transition-colors shadow-lg"
          >
            Back to Homepage
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 
                     dark:text-white rounded-lg font-medium 
                     hover:bg-gray-300 dark:hover:bg-gray-600 
                     transition-colors shadow-lg"
          >
            Go Back
          </motion.button>
        </motion.div>

        {/* Refresh Hint */}
        <motion.div
          variants={itemVariants}
          className="text-sm text-gray-500 dark:text-gray-400"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="cursor-pointer hover:text-blue-500 dark:hover:text-blue-400"
            onClick={() => window.location.reload()}
          >
            Psst! Click here for another random meme! 🎲
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}