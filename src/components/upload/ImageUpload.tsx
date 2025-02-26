// src/components/upload/ImageUpload.tsx
'use client';

import { useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
}

export default function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.startsWith('image/') || file.type === 'image/gif')) {
      processFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string;
      setPreview(previewUrl);
      onImageSelect(file, previewUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8
                    ${dragActive 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' 
                      : 'border-gray-300 dark:border-gray-600'}`}
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
              <button
                onClick={() => setPreview(null)}
                className="absolute top-2 right-2 p-1 bg-gray-800/50 rounded-full
                           hover:bg-gray-800/75 transition-colors"
              >
                <CloudArrowUpIcon className="w-5 h-5 text-white" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-lg text-center mb-2">
                Drag and drop your meme here, or{' '}
                <button
                  onClick={() => inputRef.current?.click()}
                  className="text-blue-500 hover:text-blue-600"
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
      </div>
    </div>
  );
}