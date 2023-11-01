import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  downloadModal: false,
  progressModal: false,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    toggleDownloadModal: (state, action) => {
      const { type } = action.payload;
      if (type === 'download') {
        const { downloadModal } = action.payload;
        return {
          ...state,
          downloadModal,
        };
      }
      if (type === 'progress') {
        const { progressModal } = action.payload;
        return {
          ...state,
          progressModal,
        };
      }
      return {
        ...state,
      };
    },
  },
});

export const { toggleDownloadModal } = modalSlice.actions;
export default modalSlice.reducer;
