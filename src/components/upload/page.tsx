// src/app/upload/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/upload/ImageUpload';
import CaptionEditor from '@/components/upload/CaptionEditor';
import MemePreview from '@/components/upload/MemePreview';
import { Button } from '@/components/common/Button';

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '77481efedac350777b1cb7232fd842f8';

const renderMemeOnCanvas = (
  imageUrl: string,
  topText: string,
  bottomText: string
): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    
    image.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = image.width;
      canvas.height = image.height;
      
      // Draw the image
      ctx!.drawImage(image, 0, 0);
      
      // Configure text style
      ctx!.fillStyle = 'white';
      ctx!.strokeStyle = 'black';
      ctx!.lineWidth = 3;
      ctx!.textAlign = 'center';
      
      // Calculate font size based on canvas width
      const fontSize = canvas.width * 0.1;
      ctx!.font = `bold ${fontSize}px Impact`;
      
      // Add top text
      if (topText) {
        ctx!.textBaseline = 'top';
        ctx!.strokeText(topText, canvas.width / 2, fontSize * 0.2);
        ctx!.fillText(topText, canvas.width / 2, fontSize * 0.2);
      }
      
      // Add bottom text
      if (bottomText) {
        ctx!.textBaseline = 'bottom';
        ctx!.strokeText(bottomText, canvas.width / 2, canvas.height - fontSize * 0.2);
        ctx!.fillText(bottomText, canvas.width / 2, canvas.height - fontSize * 0.2);
      }
      
      // Convert canvas to base64
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    
    image.src = imageUrl;
  });
};

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
  };

  const generateAICaption = async () => {
    setIsGenerating(true);
    try {
      // Example API call to an AI service
      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "text-davinci-003",
          prompt: "Generate a funny meme caption:",
          max_tokens: 30,
        }),
      });

      const data = await response.json();
      const caption = data.choices[0].text.trim();
      
      // Split the caption into top and bottom text
      const [top, bottom] = caption.split('\n');
      setTopText(top || '');
      setBottomText(bottom || '');
    } catch (error) {
      console.error('Error generating caption:', error);
      setError('Failed to generate caption');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !previewUrl) {
      setError('Please select an image first');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Render the meme with captions
      const memeWithCaptions = await renderMemeOnCanvas(previewUrl, topText, bottomText);
      
      // Extract base64 data
      const base64Image = memeWithCaptions.split(',')[1];
      
      // Create FormData for ImgBB
      const formData = new FormData();
      formData.append('key', IMGBB_API_KEY);
      formData.append('image', base64Image);

      // Upload to ImgBB
      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to upload image');
      }

      // Create meme object
      const newMeme = {
        id: Date.now().toString(),
        title: selectedFile.name.split('.')[0],
        imageUrl: data.data.url,
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
      
      // Add new meme to the beginning of the array
      uploadedMemes.unshift(newMeme);
      
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
                       text-red-700 dark:text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <ImageUpload onImageSelect={handleImageSelect} />
          
          {previewUrl && (
            <CaptionEditor
              onCaptionChange={handleCaptionChange}
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