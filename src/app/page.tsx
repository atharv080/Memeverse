// src/app/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TrendingMemes from '@/components/memes/TrendingMemes';
import { Button } from '@/components/common/Button';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleExplore = () => {
    router.push('/explore');
  };

  const handleUpload = () => {
    router.push('/upload');
  };

  if (!mounted) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-12 py-8"
    >
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto">
        <motion.div
          variants={itemVariants}
          className="relative"
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-white"
            whileHover={{ scale: 1.02 }}
          >
            Welcome to{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              MemeVerse
            </span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8"
          >
            Your ultimate destination for memes
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center gap-4 mt-8"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleExplore}
              >
                Start Exploring
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleUpload}
              >
                Upload Meme
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Trending Section */}
      <section>
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center mb-8"
        >
          <motion.h2
            className="text-2xl font-semibold text-gray-900 dark:text-white"
            whileHover={{ scale: 1.02 }}
          >
            Trending Memes
          </motion.h2>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="ghost"
              onClick={handleExplore}
            >
              View All →
            </Button>
          </motion.div>
        </motion.div>

        <Suspense fallback={<LoadingAnimation />}>
          <TrendingMemes />
        </Suspense>
      </section>

      <ClientFloatingElements />
    </motion.div>
  );
}

// Loading Animation Component
function LoadingAnimation() {
  return (
    <motion.div
      className="flex items-center justify-center min-h-[400px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
}

// Create a separate client component for FloatingElements
const ClientFloatingElements = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  if (!dimensions.width) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-blue-500 rounded-full opacity-20"
          initial={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
          }}
          animate={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
            transition: {
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            },
          }}
        />
      ))}
    </div>
  );
};