export interface Meme {
  id: string;
  title: string;
  imageUrl: string;
  likes: number;
  comments: number;
  creator?: User;
  createdAt?: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
}

export type CategoryOption = 'trending' | 'new' | 'classic' | 'random';
export type SortOption = 'likes' | 'date' | 'comments';