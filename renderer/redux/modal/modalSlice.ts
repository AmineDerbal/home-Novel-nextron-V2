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
      return {
        ...state,
      };
    },
  },
});

export const { toggleDownloadModal } = modalSlice.actions;
export default modalSlice.reducer;
