// src/components/upload/ImageUpload.tsx
'use client';

import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { uploadToImgBB } from '@/lib/utils/imageUpload';

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: string) => void;
}

export default function ImageUpload({ 
  onImageSelect, 
  onUploadSuccess,
  onUploadError 
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.startsWith('image/') || file.type === 'image/gif')) {
      await processFile(file);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      onUploadError?.('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string;
      setPreview(previewUrl);
      onImageSelect(file, previewUrl);
    };
    reader.readAsDataURL(file);

    // Upload to ImgBB
    try {
      setUploading(true);
      const imageUrl = await uploadToImgBB(file);
      onUploadSuccess?.(imageUrl);
    } catch (error) {
      onUploadError?.(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8
                    ${dragActive 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' 
                      : 'border-gray-300 dark:border-gray-600'}
                    ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/*,.gif"
          onChange={handleChange}
          disabled={uploading}
        />

        <AnimatePresence>
          {preview ? (
            <div className="relative aspect-video">
              <Image
                src={preview}
                alt="Upload preview"
                fill
                className="object-contain rounded-lg"
              />
              {!uploading && (
                <button
                  onClick={handleReset}
                  className="absolute top-2 right-2 p-1 bg-gray-800/50 rounded-full
                           hover:bg-gray-800/75 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-white" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-lg text-center mb-2">
                Drag and drop your meme here, or{' '}
                <button
                  onClick={() => inputRef.current?.click()}
                  className="text-blue-500 hover:text-blue-600"
                  disabled={uploading}
                >
                  browse
                </button>
              </p>
              <p className="text-sm text-gray-500">
                Supports: JPG, PNG, GIF (Max 5MB)
              </p>
            </div>
          )}
        </AnimatePresence>

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}