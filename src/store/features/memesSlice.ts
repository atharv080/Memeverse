// src/store/features/memesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Meme } from '@/lib/types';

interface MemesState {
  items: Meme[];
  loading: boolean;
  error: string | null;
}

const initialState: MemesState = {
  items: [],
  loading: false,
  error: null,
};

const memesSlice = createSlice({
  name: 'memes',
  initialState,
  reducers: {
    setMemes: (state, action: PayloadAction<Meme[]>) => {
      state.items = action.payload;
    },
    addMeme: (state, action: PayloadAction<Meme>) => {
      state.items.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setMemes, addMeme, setLoading, setError } = memesSlice.actions;
export default memesSlice.reducer;