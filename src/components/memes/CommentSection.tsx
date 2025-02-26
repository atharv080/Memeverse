'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/common/Button';

interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

interface CommentSectionProps {
  memeId: string;
}

export default function CommentSection({ memeId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Load comments from localStorage
    const storedComments = JSON.parse(localStorage.getItem(`comments-${memeId}`) || '[]');
    setComments(storedComments);
  }, [memeId]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: 'Anonymous User',
      createdAt: new Date().toISOString(),
    };

    const updatedComments = [comment, ...comments];
    setComments(updatedComments);
    setNewComment('');

    // Save to localStorage
    localStorage.setItem(`comments-${memeId}`, JSON.stringify(updatedComments));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600
                    bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        <Button onClick={handleAddComment}>
          Post Comment
        </Button>
      </div>

      <AnimatePresence mode="popLayout">
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{comment.author}</span>
              <span className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}