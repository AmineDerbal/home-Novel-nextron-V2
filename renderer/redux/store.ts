import { configureStore } from '@reduxjs/toolkit';
import novelReducer from './novel/novelSlice';

const store = configureStore({
  reducer: {
    novel: novelReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>; // Define and export RootState type
export default store;
