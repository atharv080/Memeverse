// src/lib/types/index.ts
export interface Meme {
    id: string;
    title: string;
    imageUrl: string;
    likes: number;
    comments: number;
    creator?: {
      id: string;
      username: string;
    };
    createdAt?: string;
  }
  
  export type CategoryOption = 'trending' | 'new' | 'classic' | 'random';
  export type SortOption = 'likes' | 'date' | 'comments';
  // src/types/index.ts 
  