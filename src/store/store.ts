import { configureStore } from '@reduxjs/toolkit';
import memesReducer from './features/memesSlice';
import userReducer from './features/userSlice';

export const store = configureStore({
  reducer: {
    memes: memesReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;