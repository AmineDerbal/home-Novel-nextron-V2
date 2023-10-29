import { configureStore } from '@reduxjs/toolkit';
import novelReducer from './novel/novelSlice';
import modalReducer from './modal/modalSlice';

const store = configureStore({
  reducer: {
    novel: novelReducer,
    modal: modalReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>; // Define and export RootState type
export default store;
