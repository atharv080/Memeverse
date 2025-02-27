// src/components/upload/CaptionEditor.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface CaptionEditorProps {
  onCaptionChange: (topText: string, bottomText: string) => void;
  onGenerateAI: () => Promise<void>;
  isGenerating: boolean;
  topText: string;
  bottomText: string;
}

export default function CaptionEditor({ 
  onCaptionChange, 
  onGenerateAI, 
  isGenerating 
}: CaptionEditorProps) {
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');

  const handleTopTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopText(e.target.value);
    onCaptionChange(e.target.value, bottomText);
  };

  const handleBottomTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBottomText(e.target.value);
    onCaptionChange(topText, e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Top Text
        </label>
        <input
          type="text"
          value={topText}
          onChange={handleTopTextChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
          placeholder="Enter top caption"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Bottom Text
        </label>
        <input
          type="text"
          value={bottomText}
          onChange={handleBottomTextChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
          placeholder="Enter bottom caption"
        />
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={onGenerateAI}
          disabled={isGenerating}
          className="w-full flex items-center justify-center space-x-2"
        >
          <SparklesIcon className="w-5 h-5" />
          <span>{isGenerating ? 'Generating...' : 'Generate AI Caption'}</span>
        </Button>
      </motion.div>
    </div>
  );
}