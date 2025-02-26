// src/app/upload/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/upload/ImageUpload';
import CaptionEditor from '@/components/upload/CaptionEditor';
import MemePreview from '@/components/upload/MemePreview';
import { Button } from '@/components/common/Button';
import { generateMemeCaption } from '@/lib/utils/aiCaption';

export default function UploadPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedFile(file);
    setPreviewUrl(preview);
  };

  const handleCaptionChange = (top: string, bottom: string) => {
    setTopText(top);
    setBottomText(bottom);
  };

  const generateAICaption = async () => {
    setIsGenerating(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate caption
      const { topText: newTopText, bottomText: newBottomText } = generateMemeCaption();
      
      // Update state
      setTopText(newTopText);
      setBottomText(newBottomText);
      handleCaptionChange(newTopText, newBottomText);
    } catch (error) {
      console.error('Error generating caption:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('topText', topText);
      formData.append('bottomText', bottomText);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push('/meme/new-meme-id');
    } catch (error) {
      console.error('Error uploading meme:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto py-8 px-4 space-y-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Create Your Meme
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <ImageUpload onImageSelect={handleImageSelect} />
          
          {previewUrl && (
            <CaptionEditor
              onCaptionChange={handleCaptionChange}
              onGenerateAI={generateAICaption}
              isGenerating={isGenerating}
            />
          )}
        </div>

        {previewUrl && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Preview
            </h2>
            <MemePreview
              imageUrl={previewUrl}
              topText={topText}
              bottomText={bottomText}
            />
          </div>
        )}
      </div>

      {previewUrl && (
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload Meme'}
          </Button>
        </div>
      )}
    </motion.div>
  );
}