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

const renderMemeOnCanvas = async (
  imageUrl: string,
  topText: string,
  bottomText: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Configure text style
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = Math.max(canvas.width * 0.004, 4); // Adjust line width based on image size
      ctx.textAlign = 'center';

      // Calculate font size based on image width
      const fontSize = Math.max(canvas.width * 0.08, 30); // Minimum font size of 30px
      ctx.font = `bold ${fontSize}px Impact`;

      // Function to wrap text
      const wrapText = (text: string, maxWidth: number): string[] => {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
          const width = ctx.measureText(currentLine + ' ' + words[i]).width;
          if (width < maxWidth) {
            currentLine += ' ' + words[i];
          } else {
            lines.push(currentLine);
            currentLine = words[i];
          }
        }
        lines.push(currentLine);
        return lines;
      };

      // Draw top text
      if (topText) {
        const maxWidth = canvas.width * 0.9;
        const lines = wrapText(topText.toUpperCase(), maxWidth);
        const lineHeight = fontSize * 1.2;
        const totalHeight = lines.length * lineHeight;
        const startY = Math.max(fontSize, totalHeight);

        lines.forEach((line, index) => {
          const y = startY + (index * lineHeight);
          ctx.strokeText(line, canvas.width / 2, y);
          ctx.fillText(line, canvas.width / 2, y);
        });
      }

      // Draw bottom text
      if (bottomText) {
        const maxWidth = canvas.width * 0.9;
        const lines = wrapText(bottomText.toUpperCase(), maxWidth);
        const lineHeight = fontSize * 1.2;
        const totalHeight = lines.length * lineHeight;
        const startY = canvas.height - (totalHeight * 1.2);

        lines.forEach((line, index) => {
          const y = startY + (index * lineHeight);
          ctx.strokeText(line, canvas.width / 2, y);
          ctx.fillText(line, canvas.width / 2, y);
        });
      }

      // Convert to base64 with high quality
      resolve(canvas.toDataURL('image/jpeg', 1.0));
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Load image from URL
    img.src = imageUrl;
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
      // Temporary mock captions for testing
      const mockCaptions = [
        { top: "When you finally", bottom: "fix that bug" },
        { top: "Me explaining", bottom: "my code to rubber duck" },
        { top: "Nobody:", bottom: "JavaScript developers" },
        { top: "When the code", bottom: "works on first try" },
        { top: "Debug the code", bottom: "Add more bugs" }
      ];

      // Randomly select a caption
      const randomCaption = mockCaptions[Math.floor(Math.random() * mockCaptions.length)];
      
      setTopText(randomCaption.top);
      setBottomText(randomCaption.bottom);
      handleCaptionChange(randomCaption.top, randomCaption.bottom);
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