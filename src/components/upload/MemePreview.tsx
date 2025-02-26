'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface MemePreviewProps {
  imageUrl: string;
  topText: string;
  bottomText: string;
}

export default function MemePreview({ imageUrl, topText, bottomText }: MemePreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative aspect-square max-w-2xl mx-auto overflow-hidden rounded-lg"
    >
      <Image
        src={imageUrl}
        alt="Meme preview"
        fill
        className="object-contain"
      />
      
      {topText && (
        <div className="absolute top-4 left-0 right-0 text-center">
          <p className="text-4xl font-bold text-white uppercase tracking-wide
                        stroke-black" style={{ WebkitTextStroke: '2px black' }}>
            {topText}
          </p>
        </div>
      )}

      {bottomText && (
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <p className="text-4xl font-bold text-white uppercase tracking-wide
                        stroke-black" style={{ WebkitTextStroke: '2px black' }}>
            {bottomText}
          </p>
        </div>
      )}
    </motion.div>
  );
}