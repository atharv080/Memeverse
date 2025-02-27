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

// It's better to handle this through environment variables and a backend service
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '77481efedac350777b1cb7232fd842f8';

export default function UploadPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedFile(file);
    setPreviewUrl(preview);
    setError(null);
  };

  const handleCaptionChange = (top: string, bottom: string) => {
    setTopText(top);
    setBottomText(bottom);
    setError(null);
  };

  const generateAICaption = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const { topText: newTopText, bottomText: newBottomText } = await generateMemeCaption();
      setTopText(newTopText);
      setBottomText(newBottomText);
      handleCaptionChange(newTopText, newBottomText);
    } catch (error) {
      console.error('Error generating caption:', error);
      setError('Failed to generate caption. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const uploadToImgBB = async (base64Image: string): Promise<string> => {
    const formData = new FormData();
    formData.append('image', base64Image);
    formData.append('key', IMGBB_API_KEY);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error?.message || 'Failed to upload image');
    }

    return data.data.url;
  };

  const handleUpload = async () => {
    if (!selectedFile || !previewUrl) {
      setError('Please select an image first');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Extract base64 image data
      const base64Image = previewUrl.split(',')[1];
      if (!base64Image) {
        throw new Error('Invalid image format');
      }

      // Upload image to ImgBB
      const imageUrl = await uploadToImgBB(base64Image);

      // Create meme object
      const newMeme = {
        id: Date.now().toString(),
        title: selectedFile.name.split('.')[0],
        imageUrl: imageUrl,
        topText,
        bottomText,
        likes: 0,
        comments: 0,
        creator: {
          id: '1',
          username: 'Anonymous',
        },
        createdAt: new Date().toISOString(),
      };

      // Get existing uploaded memes
      const uploadedMemes = JSON.parse(localStorage.getItem('uploadedMemes') || '[]');
      
      // Add new meme to uploaded memes
      uploadedMemes.push(newMeme);
      
      // Save updated list
      localStorage.setItem('uploadedMemes', JSON.stringify(uploadedMemes));

      // Navigate to profile page
      router.push('/profile');
    } catch (error) {
      console.error('Error uploading:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload image. Please try again.');
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

      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 
                       text-red-700 dark:text-red-400 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <ImageUpload onImageSelect={handleImageSelect} />
          
          {previewUrl && (
            <CaptionEditor
            onCaptionChange={(top: string, bottom: string) => handleCaptionChange(top, bottom)}
            onGenerateAI={generateAICaption}
            isGenerating={isGenerating}
            topText={topText}
            bottomText={bottomText}
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
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <span className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Uploading...</span>
              </span>
            ) : (
              'Upload Meme'
            )}
          </Button>
        </div>
      )}
    </motion.div>
  );
}