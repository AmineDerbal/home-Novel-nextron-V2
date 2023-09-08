import { configureStore } from '@reduxjs/toolkit';
import novelReducer from './novel/novelSlice';

const store = configureStore({
  reducer: {
    novel: novelReducer,
  },
});

export default store;
