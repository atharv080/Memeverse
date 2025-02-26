// src/app/profile/page.tsx
'use client';

import { motion } from 'framer-motion';
import ProfileHeader from '@/components/profile/ProfileHeader';
import MemeTabs from '@/components/profile/MemeTabs';

export default function ProfilePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto py-8 px-4 space-y-8"
    >
      <ProfileHeader />
      <MemeTabs />
    </motion.div>
  );
}